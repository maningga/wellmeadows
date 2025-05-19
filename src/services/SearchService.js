// Mock data for demonstration
const mockData = {
  patients: [
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '123-456-7890',
      status: 'Admitted',
      ward: 'Cardiology',
      admissionDate: '2024-02-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      contact: '987-654-3210',
      status: 'Discharged',
      ward: 'Orthopedics',
      admissionDate: '2024-02-10',
    },
    // Add more mock patients here
  ],
  medications: [
    {
      id: 1,
      name: 'Amoxicillin',
      type: 'Antibiotic',
      quantity: 500,
      unit: 'tablets',
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Ibuprofen',
      type: 'Pain Reliever',
      quantity: 1000,
      unit: 'tablets',
      status: 'Low Stock',
    },
    // Add more mock medications here
  ],
  resources: [
    {
      id: 1,
      name: 'MRI Machine',
      location: 'Radiology',
      status: 'Available',
      lastMaintenance: '2024-01-15',
    },
    {
      id: 2,
      name: 'CT Scanner',
      location: 'Emergency',
      status: 'In Use',
      lastMaintenance: '2024-02-01',
    },
    // Add more mock resources here
  ],
  staff: [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      department: 'Cardiology',
      status: 'On Duty',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Neurologist',
      department: 'Neurology',
      status: 'Off Duty',
    },
    // Add more mock staff here
  ],
};

class SearchService {
  constructor() {
    this.data = mockData;
  }

  // Search across all categories
  async searchGlobal(query) {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const results = [];

    // Search patients
    const patients = this.data.patients.filter(patient =>
      this.matchesSearch(patient, normalizedQuery)
    ).map(patient => ({
      type: 'patient',
      title: patient.name,
      subtitle: `Patient ID: ${patient.id} | ${patient.status}`,
      link: `/patients/${patient.id}`,
      data: patient,
    }));

    // Search medications
    const medications = this.data.medications.filter(med =>
      this.matchesSearch(med, normalizedQuery)
    ).map(med => ({
      type: 'medication',
      title: med.name,
      subtitle: `${med.type} | Stock: ${med.quantity} ${med.unit}`,
      link: `/medications/${med.id}`,
      data: med,
    }));

    // Search resources
    const resources = this.data.resources.filter(resource =>
      this.matchesSearch(resource, normalizedQuery)
    ).map(resource => ({
      type: 'resource',
      title: resource.name,
      subtitle: `${resource.location} | ${resource.status}`,
      link: `/resources/${resource.id}`,
      data: resource,
    }));

    // Search staff
    const staff = this.data.staff.filter(person =>
      this.matchesSearch(person, normalizedQuery)
    ).map(person => ({
      type: 'staff',
      title: person.name,
      subtitle: `${person.role} | ${person.department}`,
      link: `/staff/${person.id}`,
      data: person,
    }));

    return [...patients, ...medications, ...resources, ...staff];
  }

  // Search within a specific category
  async searchCategory(category, query, filters = {}) {
    if (!this.data[category]) {
      throw new Error(`Invalid category: ${category}`);
    }

    const normalizedQuery = query.toLowerCase();
    let results = this.data[category].filter(item =>
      this.matchesSearch(item, normalizedQuery)
    );

    // Apply filters if any
    if (Object.keys(filters).length > 0) {
      results = results.filter(item =>
        Object.entries(filters).every(([key, value]) =>
          value === '' || item[key] === value
        )
      );
    }

    return results;
  }

  // Helper method to check if an item matches the search query
  matchesSearch(item, query) {
    return Object.values(item).some(value =>
      value && value.toString().toLowerCase().includes(query)
    );
  }

  // Get available filters for a category
  getFilters(category) {
    const filters = {
      patients: ['status', 'ward', 'gender'],
      medications: ['type', 'status'],
      resources: ['location', 'status'],
      staff: ['role', 'department', 'status'],
    };

    return filters[category] || [];
  }

  // Get unique values for a filter in a category
  getFilterValues(category, filterName) {
    if (!this.data[category]) return [];

    return [...new Set(this.data[category].map(item => item[filterName]))];
  }
}

export default new SearchService(); 