const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wellmeadows_hospital',
  port: process.env.DB_PORT || 5432,
});

// Report endpoints
app.get('/api/reports/staff', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.staff_number,
        s.first_name,
        s.last_name,
        s.position,
        w.ward_name
      FROM staff s
      LEFT JOIN wards w ON s.allocated_ward = w.ward_number
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching staff report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/ward', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        w.ward_name,
        w.total_beds,
        COUNT(i.patient_number) as occupied_beds,
        w.total_beds - COUNT(i.patient_number) as available_beds
      FROM wards w
      LEFT JOIN inpatients i ON w.ward_number = i.ward_number
      GROUP BY w.ward_number, w.ward_name, w.total_beds
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ward report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/medication', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.name,
        d.quantity_in_stock,
        COUNT(pm.medication_id) as times_prescribed,
        SUM(pm.units_per_day) as total_units_prescribed
      FROM drugs d
      LEFT JOIN patientmedication pm ON d.drug_number = pm.drug_number
      GROUP BY d.drug_number, d.name, d.quantity_in_stock
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching medication report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/supply', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        name,
        supply_type,
        quantity_in_stock,
        reorder_level,
        CASE WHEN quantity_in_stock <= reorder_level THEN true ELSE false END as needs_reorder
      FROM supplies
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching supply report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/bed', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        w.ward_name,
        w.total_beds,
        COUNT(i.patient_number) as occupied_beds,
        w.total_beds - COUNT(i.patient_number) as available_beds,
        ROUND((COUNT(i.patient_number)::float / w.total_beds) * 100, 2) as occupancy_rate
      FROM wards w
      LEFT JOIN inpatients i ON w.ward_number = i.ward_number
      GROUP BY w.ward_number, w.ward_name, w.total_beds
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bed report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/analytics', async (req, res) => {
  try {
    const [patientStats, staffStats, wardOccupancy] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*) as total_patients,
          COUNT(CASE WHEN p.patient_number IN (SELECT patient_number FROM inpatients) THEN 1 END) as inpatients,
          COUNT(CASE WHEN p.patient_number IN (SELECT patient_number FROM outpatients) THEN 1 END) as outpatients
        FROM patients p
      `),
      pool.query(`
        SELECT position, COUNT(*) as count
        FROM staff
        GROUP BY position
      `),
      pool.query(`
        SELECT 
          w.ward_name,
          w.total_beds,
          COUNT(i.patient_number) as occupied_beds,
          ROUND((COUNT(i.patient_number)::float / w.total_beds) * 100, 2) as occupancy_rate
        FROM wards w
        LEFT JOIN inpatients i ON w.ward_number = i.ward_number
        GROUP BY w.ward_number, w.ward_name, w.total_beds
      `)
    ]);

    res.json({
      patientStats: patientStats.rows,
      staffStats: staffStats.rows,
      wardOccupancy: wardOccupancy.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 