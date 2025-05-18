const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Staff Allocation Report
router.get('/staff', async (req, res) => {
  try {
    const staffQuery = `
      SELECT s.staff_number, s.first_name, s.last_name, s.position,
             w.ward_name, w.ward_number
      FROM staff s
      LEFT JOIN wards w ON s.allocated_ward = w.ward_number
      ORDER BY w.ward_name, s.position;
    `;
    const result = await db.query(staffQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error generating staff report' });
  }
});

// Ward/Patient Report
router.get('/ward', async (req, res) => {
  try {
    const wardQuery = `
      SELECT w.ward_number, w.ward_name, w.total_beds,
             COUNT(i.patient_number) as occupied_beds,
             w.total_beds - COUNT(i.patient_number) as available_beds
      FROM wards w
      LEFT JOIN inpatients i ON w.ward_number = i.ward_number
      GROUP BY w.ward_number, w.ward_name, w.total_beds
      ORDER BY w.ward_number;
    `;
    const result = await db.query(wardQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error generating ward report' });
  }
});

// Medication Usage Report
router.get('/medication', async (req, res) => {
  try {
    const medicationQuery = `
      SELECT d.drug_number, d.name, d.quantity_in_stock,
             COUNT(pm.medication_id) as times_prescribed,
             SUM(pm.units_per_day * 
                 EXTRACT(DAY FROM (pm.finish_date - pm.start_date))) as total_units_prescribed
      FROM drugs d
      LEFT JOIN patientmedication pm ON d.drug_number = pm.drug_number
      GROUP BY d.drug_number, d.name, d.quantity_in_stock
      ORDER BY times_prescribed DESC;
    `;
    const result = await db.query(medicationQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error generating medication report' });
  }
});

// Supply Inventory Report
router.get('/supply', async (req, res) => {
  try {
    const supplyQuery = `
      SELECT s.item_number, s.name, s.supply_type,
             s.quantity_in_stock, s.reorder_level,
             CASE WHEN s.quantity_in_stock <= s.reorder_level 
                  THEN true ELSE false END as needs_reorder
      FROM supplies s
      ORDER BY needs_reorder DESC, s.supply_type, s.name;
    `;
    const result = await db.query(supplyQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error generating supply report' });
  }
});

// Bed Occupancy Report
router.get('/bed', async (req, res) => {
  try {
    const bedQuery = `
      SELECT w.ward_number, w.ward_name,
             w.total_beds,
             COUNT(i.patient_number) as occupied_beds,
             w.total_beds - COUNT(i.patient_number) as available_beds,
             ROUND((COUNT(i.patient_number)::float / w.total_beds * 100), 2) as occupancy_rate
      FROM wards w
      LEFT JOIN inpatients i ON w.ward_number = i.ward_number
      GROUP BY w.ward_number, w.ward_name, w.total_beds
      ORDER BY occupancy_rate DESC;
    `;
    const result = await db.query(bedQuery);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error generating bed occupancy report' });
  }
});

// Analytics Dashboard Report
router.get('/analytics', async (req, res) => {
  try {
    const analyticsQueries = {
      patientStats: `
        SELECT 
          COUNT(DISTINCT p.patient_number) as total_patients,
          COUNT(DISTINCT i.patient_number) as inpatients,
          COUNT(DISTINCT o.patient_number) as outpatients,
          COUNT(DISTINCT a.appointment_number) as total_appointments
        FROM patients p
        LEFT JOIN inpatients i ON p.patient_number = i.patient_number
        LEFT JOIN outpatients o ON p.patient_number = o.patient_number
        LEFT JOIN appointments a ON p.patient_number = a.patient_number;
      `,
      staffStats: `
        SELECT 
          position,
          COUNT(*) as count
        FROM staff
        GROUP BY position
        ORDER BY count DESC;
      `,
      wardOccupancy: `
        SELECT 
          w.ward_name,
          w.total_beds,
          COUNT(i.patient_number) as occupied_beds,
          ROUND((COUNT(i.patient_number)::float / w.total_beds * 100), 2) as occupancy_rate
        FROM wards w
        LEFT JOIN inpatients i ON w.ward_number = i.ward_number
        GROUP BY w.ward_name, w.total_beds
        ORDER BY occupancy_rate DESC;
      `
    };

    const results = {};
    for (const [key, query] of Object.entries(analyticsQueries)) {
      const result = await db.query(query);
      results[key] = result.rows;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error generating analytics report' });
  }
});

module.exports = router; 