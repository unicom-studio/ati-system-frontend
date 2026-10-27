import api from './api';

// Initial realistic ATI student dataset for immediate out-of-the-box operation & fallback
const DEFAULT_STUDENTS = [
  {
    _id: 'std_01',
    regNo: 'KE/IT/2023/0042',
    nic: '200134502891',
    idNumber: 'ATI-IT-23-042',
    name: 'Kavindu Senarathne',
    course: 'Higher National Diploma in Information Technology (HNDIT)',
    courseStartedDate: '2023-02-15',
    status: 'Active',
    email: 'kavindu.s@ati.edu.lk',
    phone: '+94 77 123 4567',
    batch: '2023 Full Time',
    createdAt: '2023-02-10T08:00:00.000Z'
  },
  {
    _id: 'std_02',
    regNo: 'KE/BM/2023/0018',
    nic: '200278901234',
    idNumber: 'ATI-BM-23-018',
    name: 'Nethmi Fernando',
    course: 'Higher National Diploma in Business Management (HNDBM)',
    courseStartedDate: '2023-02-15',
    status: 'Active',
    email: 'nethmi.f@ati.edu.lk',
    phone: '+94 71 890 1234',
    batch: '2023 Full Time',
    createdAt: '2023-02-11T09:30:00.000Z'
  },
  {
    _id: 'std_03',
    regNo: 'KE/AC/2022/0089',
    nic: '199923405678',
    idNumber: 'ATI-AC-22-089',
    name: 'Dilshan Weerasinghe',
    course: 'Higher National Diploma in Accountancy (HNDA)',
    courseStartedDate: '2022-03-01',
    status: 'Active',
    email: 'dilshan.w@ati.edu.lk',
    phone: '+94 76 555 7890',
    batch: '2022 Full Time',
    createdAt: '2022-02-28T10:15:00.000Z'
  },
  {
    _id: 'std_04',
    regNo: 'KE/EN/2023/0031',
    nic: '200156708912',
    idNumber: 'ATI-EN-23-031',
    name: 'Tharushi Jayawardena',
    course: 'Higher National Diploma in English (HNDE)',
    courseStartedDate: '2023-02-15',
    status: 'Active',
    email: 'tharushi.j@ati.edu.lk',
    phone: '+94 70 234 5678',
    batch: '2023 Full Time',
    createdAt: '2023-02-12T11:00:00.000Z'
  },
  {
    _id: 'std_05',
    regNo: 'KE/IT/2022/0014',
    nic: '200045607890',
    idNumber: 'ATI-IT-22-014',
    name: 'Sachintha Perera',
    course: 'Higher National Diploma in Information Technology (HNDIT)',
    courseStartedDate: '2022-03-01',
    status: 'Cancelled',
    email: 'sachintha.p@ati.edu.lk',
    phone: '+94 75 444 3210',
    batch: '2022 Full Time',
    createdAt: '2022-02-25T14:20:00.000Z'
  }
];

// Local Storage Helper
const STORAGE_KEY = 'ati_students_cache';
const getStoredStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_STUDENTS;
  }
};

const saveStoredStudents = (students) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const normalizeStudent = (student) => ({
  ...student,
  phone: student.phone || student.contactNo || '',
  batch: student.batch || student.academicYear || '',
});

const getResponseData = (response) => response.data?.data ?? response.data;

export const studentService = {
  // Fetch all students
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      const students = getResponseData(response);
      if (Array.isArray(students)) {
        const normalizedStudents = students.map(normalizeStudent);
        saveStoredStudents(normalizedStudents);
        return { data: normalizedStudents, source: 'backend' };
      }
      return { data: getStoredStudents(), source: 'local' };
    } catch {
      return { data: getStoredStudents(), source: 'local' };
    }
  },

  // Get single student by ID
  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return normalizeStudent(getResponseData(response));
    } catch {
      const all = getStoredStudents();
      return all.find((s) => s._id === id || s.regNo === id) || null;
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    const newStudent = normalizeStudent(getResponseData(response));
    const current = getStoredStudents().filter((student) => student._id !== newStudent._id);
    saveStoredStudents([newStudent, ...current]);
    return newStudent;
  },

  // Update existing student
  updateStudent: async (id, updateData) => {
    const response = await api.put(`/students/${id}`, updateData);
    const updated = normalizeStudent(getResponseData(response));
    const current = getStoredStudents();
    const next = current.map((student) => (student._id === id ? updated : student));
    saveStoredStudents(next);
    return updated;
  },

  // Delete student
  deleteStudent: async (id) => {
    await api.delete(`/students/${id}`);
    const current = getStoredStudents();
    const next = current.filter((s) => s._id !== id);
    saveStoredStudents(next);
    return true;
  },

  // Reset to initial demo dataset
  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }
};

export default studentService;
