-- PostgreSQL schema for Well Meadows Hospital

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS appointments (
    appointment_number SERIAL PRIMARY KEY,
    patient_number VARCHAR(10) REFERENCES patients(patient_number),
    consultant_staff_number VARCHAR(10) REFERENCES staff(staff_number),
    appointment_date TIMESTAMP,
    examination_room VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS drugs (
    drug_number SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    dosage VARCHAR(50),
    method_of_admin VARCHAR(20) CHECK (method_of_admin IN ('Oral', 'IV', 'Injection', 'Topical', 'Other')),
    quantity_in_stock INTEGER,
    reorder_level INTEGER,
    cost_per_unit DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS inpatients (
    patient_number VARCHAR(10) PRIMARY KEY REFERENCES patients(patient_number),
    ward_number INTEGER REFERENCES wards(ward_number),
    bed_number INTEGER,
    date_wait_listed DATE,
    expected_stay_days INTEGER,
    date_placed DATE,
    expected_leave_date DATE,
    actual_leave_date DATE
);

CREATE TABLE IF NOT EXISTS localdoctors (
    doctor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    clinic_number VARCHAR(20) UNIQUE,
    address TEXT,
    telephone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS nextofkin (
    nextofkin_id SERIAL PRIMARY KEY,
    patient_number VARCHAR(10) REFERENCES patients(patient_number),
    full_name VARCHAR(100),
    relationship VARCHAR(50),
    address TEXT,
    telephone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS outpatients (
    patient_number VARCHAR(10) PRIMARY KEY REFERENCES patients(patient_number),
    appointment_datetime TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patientmedication (
    medication_id SERIAL PRIMARY KEY,
    patient_number VARCHAR(10) REFERENCES patients(patient_number),
    drug_number INTEGER REFERENCES drugs(drug_number),
    dosage VARCHAR(50),
    method_of_admin VARCHAR(20) CHECK (method_of_admin IN ('Oral', 'IV', 'Injection', 'Topical', 'Other')),
    units_per_day INTEGER,
    start_date DATE,
    finish_date DATE
);

CREATE TABLE IF NOT EXISTS patients (
    patient_number VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address TEXT,
    telephone VARCHAR(20),
    dob DATE,
    sex CHAR(1),
    marital_status VARCHAR(20),
    date_registered DATE,
    local_doctor_id INTEGER REFERENCES localdoctors(doctor_id)
);

CREATE TABLE IF NOT EXISTS qualifications (
    qualification_id SERIAL PRIMARY KEY,
    staff_number VARCHAR(10) REFERENCES staff(staff_number),
    qualification_type VARCHAR(100),
    date_qualified DATE,
    institution VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS requisition (
    requisition_number SERIAL PRIMARY KEY,
    staff_number VARCHAR(10) REFERENCES staff(staff_number),
    ward_number INTEGER REFERENCES wards(ward_number),
    requisition_date DATE,
    item_number INTEGER REFERENCES supplies(item_number),
    drug_number INTEGER REFERENCES drugs(drug_number),
    quantity_required INTEGER
);

CREATE TABLE IF NOT EXISTS staff (
    staff_number VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address TEXT,
    telephone VARCHAR(20),
    dob DATE,
    sex CHAR(1),
    nin VARCHAR(15),
    position VARCHAR(50),
    current_salary DECIMAL(10,2),
    salary_scale VARCHAR(20),
    hours_per_week DECIMAL(4,1),
    contract_type VARCHAR(20) CHECK (contract_type IN ('Permanent', 'Temporary')),
    payment_type VARCHAR(20) CHECK (payment_type IN ('Weekly', 'Monthly')),
    allocated_ward INTEGER REFERENCES wards(ward_number)
);

CREATE TABLE IF NOT EXISTS staffrota (
    rota_id SERIAL PRIMARY KEY,
    staff_number VARCHAR(10) REFERENCES staff(staff_number),
    ward_number INTEGER REFERENCES wards(ward_number),
    week_start DATE,
    shift VARCHAR(20) CHECK (shift IN ('Early', 'Late', 'Night')),
    day_of_week VARCHAR(20) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
);

CREATE TABLE IF NOT EXISTS supplieritem (
    supplier_id INTEGER REFERENCES suppliers(supplier_id),
    item_number INTEGER REFERENCES supplies(item_number),
    PRIMARY KEY (supplier_id, item_number)
);

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100),
    address TEXT,
    telephone VARCHAR(20),
    fax_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS supplies (
    item_number SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    supply_type VARCHAR(20) CHECK (supply_type IN ('Surgical', 'Non-Surgical')),
    quantity_in_stock INTEGER,
    reorder_level INTEGER,
    cost_per_unit DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS wards (
    ward_number SERIAL PRIMARY KEY,
    ward_name VARCHAR(50),
    location VARCHAR(50),
    total_beds INTEGER,
    extension_number VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS workexperience (
    experience_id SERIAL PRIMARY KEY,
    staff_number VARCHAR(10) REFERENCES staff(staff_number),
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    organization VARCHAR(100)
);

-- Create indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_number);
CREATE INDEX idx_appointments_staff ON appointments(consultant_staff_number);
CREATE INDEX idx_inpatients_ward ON inpatients(ward_number);
CREATE INDEX idx_nextofkin_patient ON nextofkin(patient_number);
CREATE INDEX idx_patientmedication_patient ON patientmedication(patient_number);
CREATE INDEX idx_patientmedication_drug ON patientmedication(drug_number);
CREATE INDEX idx_patients_doctor ON patients(local_doctor_id);
CREATE INDEX idx_qualifications_staff ON qualifications(staff_number);
CREATE INDEX idx_requisition_staff ON requisition(staff_number);
CREATE INDEX idx_requisition_ward ON requisition(ward_number);
CREATE INDEX idx_requisition_item ON requisition(item_number);
CREATE INDEX idx_requisition_drug ON requisition(drug_number);
CREATE INDEX idx_staff_ward ON staff(allocated_ward);
CREATE INDEX idx_staffrota_staff ON staffrota(staff_number);
CREATE INDEX idx_staffrota_ward ON staffrota(ward_number);
CREATE INDEX idx_supplieritem_item ON supplieritem(item_number);
CREATE INDEX idx_workexperience_staff ON workexperience(staff_number); 