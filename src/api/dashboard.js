import { db } from '../config/database';
import {
  Person as PersonIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export const getDashboardData = async () => {
  try {
    // Get total patients count
    const patientsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN p.patient_number IN (SELECT patient_number FROM inpatients) THEN 1 ELSE 0 END) as inpatient,
        SUM(CASE WHEN p.patient_number IN (SELECT patient_number FROM outpatients) THEN 1 ELSE 0 END) as outpatient
      FROM patients p
    `);

    // Get staff count
    const staffResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN position LIKE '%Doctor%' THEN 1 ELSE 0 END) as doctors,
        SUM(CASE WHEN position LIKE '%Nurse%' THEN 1 ELSE 0 END) as nurses
      FROM staff
    `);

    // Get wards data
    const wardsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN bed_number IS NOT NULL THEN 1 ELSE 0 END) as occupied
      FROM wards w
      LEFT JOIN inpatients i ON w.ward_number = i.ward_number
    `);

    // Get today's appointments
    const appointmentsResult = await db.query(`
      SELECT 
        COUNT(*) as today,
        SUM(CASE WHEN appointment_date > CURRENT_TIMESTAMP THEN 1 ELSE 0 END) as upcoming
      FROM appointments
      WHERE DATE(appointment_date) = CURRENT_DATE
    `);

    // Get inventory alerts
    const inventoryResult = await db.query(`
      SELECT 
        COUNT(*) as totalItems,
        SUM(CASE WHEN quantity_in_stock <= reorder_level THEN 1 ELSE 0 END) as lowStock
      FROM (
        SELECT quantity_in_stock, reorder_level FROM drugs
        UNION ALL
        SELECT quantity_in_stock, reorder_level FROM supplies
      ) as inventory
    `);

    // Get recent activities
    const activitiesResult = await db.query(`
      (SELECT 
        'New patient registration' as title,
        CONCAT(p.first_name, ' ', p.last_name) as description,
        p.date_registered as time,
        'patient' as type
      FROM patients p
      ORDER BY p.date_registered DESC
      LIMIT 5)
      UNION ALL
      (SELECT 
        'New appointment scheduled' as title,
        CONCAT(p.first_name, ' ', p.last_name) as description,
        a.appointment_date as time,
        'appointment' as type
      FROM appointments a
      JOIN patients p ON a.patient_number = p.patient_number
      ORDER BY a.appointment_date DESC
      LIMIT 5)
      UNION ALL
      (SELECT 
        'Staff shift started' as title,
        CONCAT(s.first_name, ' ', s.last_name) as description,
        sr.week_start as time,
        'staff' as type
      FROM staffrota sr
      JOIN staff s ON sr.staff_number = s.staff_number
      ORDER BY sr.week_start DESC
      LIMIT 5)
      ORDER BY time DESC
      LIMIT 10
    `);

    // Get alerts
    const alertsResult = await db.query(`
      (SELECT 
        CONCAT('Low stock alert: ', name) as message,
        'inventory' as type,
        CURRENT_TIMESTAMP as time
      FROM drugs
      WHERE quantity_in_stock <= reorder_level
      LIMIT 5)
      UNION ALL
      (SELECT 
        CONCAT('Low stock alert: ', name) as message,
        'inventory' as type,
        CURRENT_TIMESTAMP as time
      FROM supplies
      WHERE quantity_in_stock <= reorder_level
      LIMIT 5)
      ORDER BY time DESC
      LIMIT 10
    `);

    return {
      stats: {
        patients: patientsResult[0],
        staff: staffResult[0],
        wards: wardsResult[0],
        appointments: appointmentsResult[0],
        inventory: inventoryResult[0],
      },
      recentActivity: activitiesResult.map(activity => ({
        title: activity.title,
        description: activity.description,
        time: new Date(activity.time).toLocaleString(),
        type: activity.type,
        icon: getActivityIcon(activity.type),
      })),
      alerts: alertsResult.map(alert => ({
        message: alert.message,
        time: new Date(alert.time).toLocaleString(),
        type: alert.type,
      })),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'patient':
      return <PersonIcon />;
    case 'appointment':
      return <EventIcon />;
    case 'staff':
      return <PeopleIcon />;
    default:
      return <InfoIcon />;
  }
}; 