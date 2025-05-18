const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper function to handle database errors
const handleDatabaseError = (error, res, operation) => {
  console.error(`Error during ${operation}:`, error);
  
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Database connection failed',
      details: 'Unable to connect to the database server'
    });
  }
  
  if (error.code === '42P01') {
    return res.status(500).json({
      error: 'Missing table',
      details: 'Required database table does not exist'
    });
  }

  return res.status(500).json({
    error: `Error generating ${operation}`,
    details: error.message
  });
};

// Staff Allocation Report
router.get('/staff', async (req, res) => {
  try {
    const result = await db('staff as s')
      .select(
        's.staff_number',
        's.first_name',
        's.last_name',
        's.position',
        'w.ward_name',
        'w.ward_number'
      )
      .leftJoin('wards as w', 's.allocated_ward', 'w.ward_number')
      .orderBy(['w.ward_name', 's.position']);

    res.json(result);
  } catch (error) {
    handleDatabaseError(error, res, 'staff report');
  }
});

// Ward/Patient Report
router.get('/ward', async (req, res) => {
  try {
    const result = await db('wards as w')
      .select(
        'w.ward_number',
        'w.ward_name',
        'w.total_beds',
        db.raw('COUNT(i.patient_number) as occupied_beds'),
        db.raw('w.total_beds - COUNT(i.patient_number) as available_beds')
      )
      .leftJoin('inpatients as i', 'w.ward_number', 'i.ward_number')
      .groupBy('w.ward_number', 'w.ward_name', 'w.total_beds')
      .orderBy('w.ward_number');

    res.json(result);
  } catch (error) {
    handleDatabaseError(error, res, 'ward report');
  }
});

// Medication Usage Report
router.get('/medication', async (req, res) => {
  try {
    const result = await db('drugs as d')
      .select(
        'd.drug_number',
        'd.name',
        'd.quantity_in_stock',
        db.raw('COUNT(pm.medication_id) as times_prescribed'),
        db.raw('SUM(pm.units_per_day * EXTRACT(DAY FROM (pm.finish_date - pm.start_date))) as total_units_prescribed')
      )
      .leftJoin('patientmedication as pm', 'd.drug_number', 'pm.drug_number')
      .groupBy('d.drug_number', 'd.name', 'd.quantity_in_stock')
      .orderBy('times_prescribed', 'desc');

    res.json(result);
  } catch (error) {
    handleDatabaseError(error, res, 'medication report');
  }
});

// Supply Inventory Report
router.get('/supply', async (req, res) => {
  try {
    const result = await db('supplies as s')
      .select(
        's.item_number',
        's.name',
        's.supply_type',
        's.quantity_in_stock',
        's.reorder_level',
        db.raw('CASE WHEN s.quantity_in_stock <= s.reorder_level THEN true ELSE false END as needs_reorder')
      )
      .orderBy(['needs_reorder', 's.supply_type', 's.name']);

    res.json(result);
  } catch (error) {
    handleDatabaseError(error, res, 'supply report');
  }
});

// Bed Occupancy Report
router.get('/bed', async (req, res) => {
  try {
    const result = await db('wards as w')
      .select(
        'w.ward_number',
        'w.ward_name',
        'w.total_beds',
        db.raw('COUNT(i.patient_number) as occupied_beds'),
        db.raw('w.total_beds - COUNT(i.patient_number) as available_beds'),
        db.raw('ROUND(COUNT(i.patient_number)::float / w.total_beds * 100, 2) as occupancy_rate')
      )
      .leftJoin('inpatients as i', 'w.ward_number', 'i.ward_number')
      .groupBy('w.ward_number', 'w.ward_name', 'w.total_beds')
      .orderBy('occupancy_rate', 'desc');

    res.json(result);
  } catch (error) {
    handleDatabaseError(error, res, 'bed occupancy report');
  }
});

// Analytics Dashboard Report
router.get('/analytics', async (req, res) => {
  try {
    const patientStats = await db('patients as p')
      .select(
        db.raw('COUNT(DISTINCT p.patient_number) as total_patients'),
        db.raw('COUNT(DISTINCT i.patient_number) as inpatients'),
        db.raw('COUNT(DISTINCT o.patient_number) as outpatients'),
        db.raw('COUNT(DISTINCT a.appointment_number) as total_appointments')
      )
      .leftJoin('inpatients as i', 'p.patient_number', 'i.patient_number')
      .leftJoin('outpatients as o', 'p.patient_number', 'o.patient_number')
      .leftJoin('appointments as a', 'p.patient_number', 'a.patient_number')
      .first();

    const staffStats = await db('staff')
      .select('position')
      .count('* as count')
      .groupBy('position')
      .orderBy('count', 'desc');

    const wardOccupancy = await db('wards as w')
      .select(
        'w.ward_name',
        'w.total_beds',
        db.raw('COUNT(i.patient_number) as occupied_beds'),
        db.raw('ROUND(COUNT(i.patient_number)::float / w.total_beds * 100, 2) as occupancy_rate')
      )
      .leftJoin('inpatients as i', 'w.ward_number', 'i.ward_number')
      .groupBy('w.ward_name', 'w.total_beds')
      .orderBy('occupancy_rate', 'desc');

    res.json({
      patientStats: [patientStats],
      staffStats,
      wardOccupancy
    });
  } catch (error) {
    handleDatabaseError(error, res, 'analytics report');
  }
});

module.exports = router; 