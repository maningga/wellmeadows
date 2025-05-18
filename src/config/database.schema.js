// Database Schema Configuration
const DATABASE_SCHEMA = {
  // Wards table
  wards: {
    ward_number: 'INTEGER PRIMARY KEY',
    ward_name: 'VARCHAR(50)',
    location: 'VARCHAR(50)',
    total_beds: 'INTEGER',
    extension_number: 'VARCHAR(10)',
  },

  // Staff table
  staff: {
    staff_number: 'VARCHAR(10) PRIMARY KEY',
    first_name: 'VARCHAR(50)',
    last_name: 'VARCHAR(50)',
    address: 'TEXT',
    telephone: 'VARCHAR(20)',
    dob: 'DATE',
    sex: 'CHAR(1)',
    nin: 'VARCHAR(15)',
    position: 'VARCHAR(50)',
    current_salary: 'DECIMAL(10,2)',
    salary_scale: 'VARCHAR(20)',
    hours_per_week: 'DECIMAL(4,1)',
    contract_type: 'contract_type_enum',
    payment_type: 'payment_type_enum',
    allocated_ward: 'INTEGER REFERENCES wards(ward_number)',
  },

  // Local Doctors table
  localdoctors: {
    doctor_id: 'SERIAL PRIMARY KEY',
    full_name: 'VARCHAR(100)',
    clinic_number: 'VARCHAR(20) UNIQUE',
    address: 'TEXT',
    telephone: 'VARCHAR(20)',
  },

  // Patients table
  patients: {
    patient_number: 'VARCHAR(10) PRIMARY KEY',
    first_name: 'VARCHAR(50)',
    last_name: 'VARCHAR(50)',
    address: 'TEXT',
    telephone: 'VARCHAR(20)',
    dob: 'DATE',
    sex: 'CHAR(1)',
    marital_status: 'VARCHAR(20)',
    date_registered: 'DATE',
    local_doctor_id: 'INTEGER REFERENCES localdoctors(doctor_id)',
  },

  // Next of Kin table
  nextofkin: {
    nextofkin_id: 'SERIAL PRIMARY KEY',
    patient_number: 'VARCHAR(10) REFERENCES patients(patient_number)',
    full_name: 'VARCHAR(100)',
    relationship: 'VARCHAR(50)',
    address: 'TEXT',
    telephone: 'VARCHAR(20)',
  },

  // Inpatients table
  inpatients: {
    patient_number: 'VARCHAR(10) PRIMARY KEY REFERENCES patients(patient_number)',
    ward_number: 'INTEGER REFERENCES wards(ward_number)',
    bed_number: 'INTEGER',
    date_wait_listed: 'DATE',
    expected_stay_days: 'INTEGER',
    date_placed: 'DATE',
    expected_leave_date: 'DATE',
    actual_leave_date: 'DATE',
  },

  // Outpatients table
  outpatients: {
    patient_number: 'VARCHAR(10) PRIMARY KEY REFERENCES patients(patient_number)',
    appointment_datetime: 'TIMESTAMP',
  },

  // Drugs table
  drugs: {
    drug_number: 'INTEGER PRIMARY KEY',
    name: 'VARCHAR(100)',
    description: 'TEXT',
    dosage: 'VARCHAR(50)',
    method_of_admin: 'method_of_admin_enum',
    quantity_in_stock: 'INTEGER',
    reorder_level: 'INTEGER',
    cost_per_unit: 'DECIMAL(10,2)',
  },

  // Patient Medication table
  patientmedication: {
    medication_id: 'SERIAL PRIMARY KEY',
    patient_number: 'VARCHAR(10) REFERENCES patients(patient_number)',
    drug_number: 'INTEGER REFERENCES drugs(drug_number)',
    dosage: 'VARCHAR(50)',
    method_of_admin: 'method_of_admin_enum',
    units_per_day: 'INTEGER',
    start_date: 'DATE',
    finish_date: 'DATE',
  },

  // Appointments table
  appointments: {
    appointment_number: 'INTEGER PRIMARY KEY',
    patient_number: 'VARCHAR(10) REFERENCES patients(patient_number)',
    consultant_staff_number: 'VARCHAR(10) REFERENCES staff(staff_number)',
    appointment_date: 'TIMESTAMP',
    examination_room: 'VARCHAR(20)',
  },

  // Staff Rota table
  staffrota: {
    rota_id: 'SERIAL PRIMARY KEY',
    staff_number: 'VARCHAR(10) REFERENCES staff(staff_number)',
    ward_number: 'INTEGER REFERENCES wards(ward_number)',
    week_start: 'DATE',
    shift: 'shift_enum',
    day_of_week: 'day_of_week_enum',
  },

  // Supplies table
  supplies: {
    item_number: 'INTEGER PRIMARY KEY',
    name: 'VARCHAR(100)',
    description: 'TEXT',
    supply_type: 'supply_type_enum',
    quantity_in_stock: 'INTEGER',
    reorder_level: 'INTEGER',
    cost_per_unit: 'DECIMAL(10,2)',
  },

  // Suppliers table
  suppliers: {
    supplier_id: 'SERIAL PRIMARY KEY',
    supplier_name: 'VARCHAR(100)',
    address: 'TEXT',
    telephone: 'VARCHAR(20)',
    fax_number: 'VARCHAR(20)',
  },

  // Supplier Item table
  supplieritem: {
    supplier_id: 'INTEGER REFERENCES suppliers(supplier_id)',
    item_number: 'INTEGER REFERENCES supplies(item_number)',
    PRIMARY_KEY: ['supplier_id', 'item_number'],
  },

  // Requisition table
  requisition: {
    requisition_number: 'INTEGER PRIMARY KEY',
    staff_number: 'VARCHAR(10) REFERENCES staff(staff_number)',
    ward_number: 'INTEGER REFERENCES wards(ward_number)',
    requisition_date: 'DATE',
    item_number: 'INTEGER REFERENCES supplies(item_number)',
    drug_number: 'INTEGER REFERENCES drugs(drug_number)',
    quantity_required: 'INTEGER',
  },

  // Qualifications table
  qualifications: {
    qualification_id: 'SERIAL PRIMARY KEY',
    staff_number: 'VARCHAR(10) REFERENCES staff(staff_number)',
    qualification_type: 'VARCHAR(100)',
    date_qualified: 'DATE',
    institution: 'VARCHAR(100)',
  },

  // Work Experience table
  workexperience: {
    experience_id: 'SERIAL PRIMARY KEY',
    staff_number: 'VARCHAR(10) REFERENCES staff(staff_number)',
    position: 'VARCHAR(100)',
    start_date: 'DATE',
    end_date: 'DATE',
    organization: 'VARCHAR(100)',
  },
};

export default DATABASE_SCHEMA; 