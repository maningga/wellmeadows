const schema = require('../../config/database.schema');

exports.up = function(knex) {
  return knex.schema
    // Create custom types for enums
    .raw(`
      CREATE TYPE method_of_admin_enum AS ENUM ('Oral', 'IV', 'Injection', 'Topical', 'Other');
      CREATE TYPE contract_type_enum AS ENUM ('Permanent', 'Temporary');
      CREATE TYPE payment_type_enum AS ENUM ('Weekly', 'Monthly');
      CREATE TYPE shift_enum AS ENUM ('Early', 'Late', 'Night');
      CREATE TYPE day_of_week_enum AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
      CREATE TYPE supply_type_enum AS ENUM ('Surgical', 'Non-Surgical');
    `)
    // Create wards table first as it's referenced by other tables
    .createTable('wards', table => {
      table.integer('ward_number').primary();
      table.string('ward_name', 50);
      table.string('location', 50);
      table.integer('total_beds');
      table.string('extension_number', 10);
    })
    // Create staff table
    .createTable('staff', table => {
      table.string('staff_number', 10).primary();
      table.string('first_name', 50);
      table.string('last_name', 50);
      table.text('address');
      table.string('telephone', 20);
      table.date('dob');
      table.char('sex', 1);
      table.string('nin', 15);
      table.string('position', 50);
      table.decimal('current_salary', 10, 2);
      table.string('salary_scale', 20);
      table.decimal('hours_per_week', 4, 1);
      table.specificType('contract_type', 'contract_type_enum');
      table.specificType('payment_type', 'payment_type_enum');
      table.integer('allocated_ward').references('ward_number').inTable('wards');
    })
    // Create local doctors table
    .createTable('localdoctors', table => {
      table.increments('doctor_id');
      table.string('full_name', 100);
      table.string('clinic_number', 20).unique();
      table.text('address');
      table.string('telephone', 20);
    })
    // Create patients table
    .createTable('patients', table => {
      table.string('patient_number', 10).primary();
      table.string('first_name', 50);
      table.string('last_name', 50);
      table.text('address');
      table.string('telephone', 20);
      table.date('dob');
      table.char('sex', 1);
      table.string('marital_status', 20);
      table.date('date_registered');
      table.integer('local_doctor_id').references('doctor_id').inTable('localdoctors');
    })
    // Create next of kin table
    .createTable('nextofkin', table => {
      table.increments('nextofkin_id');
      table.string('patient_number', 10).references('patient_number').inTable('patients');
      table.string('full_name', 100);
      table.string('relationship', 50);
      table.text('address');
      table.string('telephone', 20);
    })
    // Create inpatients table
    .createTable('inpatients', table => {
      table.string('patient_number', 10).primary().references('patient_number').inTable('patients');
      table.integer('ward_number').references('ward_number').inTable('wards');
      table.integer('bed_number');
      table.date('date_wait_listed');
      table.integer('expected_stay_days');
      table.date('date_placed');
      table.date('expected_leave_date');
      table.date('actual_leave_date');
    })
    // Create outpatients table
    .createTable('outpatients', table => {
      table.string('patient_number', 10).primary().references('patient_number').inTable('patients');
      table.timestamp('appointment_datetime');
    })
    // Create drugs table
    .createTable('drugs', table => {
      table.integer('drug_number').primary();
      table.string('name', 100);
      table.text('description');
      table.string('dosage', 50);
      table.specificType('method_of_admin', 'method_of_admin_enum');
      table.integer('quantity_in_stock');
      table.integer('reorder_level');
      table.decimal('cost_per_unit', 10, 2);
    })
    // Create patient medication table
    .createTable('patientmedication', table => {
      table.increments('medication_id');
      table.string('patient_number', 10).references('patient_number').inTable('patients');
      table.integer('drug_number').references('drug_number').inTable('drugs');
      table.string('dosage', 50);
      table.specificType('method_of_admin', 'method_of_admin_enum');
      table.integer('units_per_day');
      table.date('start_date');
      table.date('finish_date');
    })
    // Create appointments table
    .createTable('appointments', table => {
      table.integer('appointment_number').primary();
      table.string('patient_number', 10).references('patient_number').inTable('patients');
      table.string('consultant_staff_number', 10).references('staff_number').inTable('staff');
      table.timestamp('appointment_date');
      table.string('examination_room', 20);
    })
    // Create staff rota table
    .createTable('staffrota', table => {
      table.increments('rota_id');
      table.string('staff_number', 10).references('staff_number').inTable('staff');
      table.integer('ward_number').references('ward_number').inTable('wards');
      table.date('week_start');
      table.specificType('shift', 'shift_enum');
      table.specificType('day_of_week', 'day_of_week_enum');
    })
    // Create supplies table
    .createTable('supplies', table => {
      table.integer('item_number').primary();
      table.string('name', 100);
      table.text('description');
      table.specificType('supply_type', 'supply_type_enum');
      table.integer('quantity_in_stock');
      table.integer('reorder_level');
      table.decimal('cost_per_unit', 10, 2);
    })
    // Create suppliers table
    .createTable('suppliers', table => {
      table.increments('supplier_id');
      table.string('supplier_name', 100);
      table.text('address');
      table.string('telephone', 20);
      table.string('fax_number', 20);
    })
    // Create supplier item table
    .createTable('supplieritem', table => {
      table.integer('supplier_id').references('supplier_id').inTable('suppliers');
      table.integer('item_number').references('item_number').inTable('supplies');
      table.primary(['supplier_id', 'item_number']);
    })
    // Create requisition table
    .createTable('requisition', table => {
      table.integer('requisition_number').primary();
      table.string('staff_number', 10).references('staff_number').inTable('staff');
      table.integer('ward_number').references('ward_number').inTable('wards');
      table.date('requisition_date');
      table.integer('item_number').references('item_number').inTable('supplies');
      table.integer('drug_number').references('drug_number').inTable('drugs');
      table.integer('quantity_required');
    })
    // Create qualifications table
    .createTable('qualifications', table => {
      table.increments('qualification_id');
      table.string('staff_number', 10).references('staff_number').inTable('staff');
      table.string('qualification_type', 100);
      table.date('date_qualified');
      table.string('institution', 100);
    })
    // Create work experience table
    .createTable('workexperience', table => {
      table.increments('experience_id');
      table.string('staff_number', 10).references('staff_number').inTable('staff');
      table.string('position', 100);
      table.date('start_date');
      table.date('end_date');
      table.string('organization', 100);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('workexperience')
    .dropTableIfExists('qualifications')
    .dropTableIfExists('requisition')
    .dropTableIfExists('supplieritem')
    .dropTableIfExists('suppliers')
    .dropTableIfExists('supplies')
    .dropTableIfExists('staffrota')
    .dropTableIfExists('appointments')
    .dropTableIfExists('patientmedication')
    .dropTableIfExists('drugs')
    .dropTableIfExists('outpatients')
    .dropTableIfExists('inpatients')
    .dropTableIfExists('nextofkin')
    .dropTableIfExists('patients')
    .dropTableIfExists('localdoctors')
    .dropTableIfExists('staff')
    .dropTableIfExists('wards')
    .raw(`
      DROP TYPE IF EXISTS method_of_admin_enum;
      DROP TYPE IF EXISTS contract_type_enum;
      DROP TYPE IF EXISTS payment_type_enum;
      DROP TYPE IF EXISTS shift_enum;
      DROP TYPE IF EXISTS day_of_week_enum;
      DROP TYPE IF EXISTS supply_type_enum;
    `);
}; 