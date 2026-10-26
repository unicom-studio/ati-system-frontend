import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users, Search, UserPlus, Edit3, Trash2, FileText, RefreshCw
} from 'lucide-react';
import studentService from '../services/studentService';
import StudentModal from '../components/StudentModal';
import Toast from '../components/Toast';

const ALL_COURSES_LABEL = 'All Courses';
const ATI_COURSES_FILTER = [
  ALL_COURSES_LABEL,
  'Higher National Diploma in Information Technology (HNDIT)',
  'Higher National Diploma in Business Management (HNDBM)',
  'Higher National Diploma in Accountancy (HNDA)',
  'Higher National Diploma in English (HNDE)'
];

export const ManageStudents = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [courseFilter, setCourseFilter] = useState(ALL_COURSES_LABEL);
  const [statusFilter, setStatusFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { setSearchQuery(initialQuery); }, [initialQuery]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAllStudents();
      setStudents(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudent = async (data) => {
    try {
      if (studentToEdit) {
        await studentService.updateStudent(studentToEdit._id, data);
        setToastMessage(`${data.name} updated successfully!`);
      } else {
        await studentService.createStudent(data);
        setToastMessage(`${data.name} registered successfully!`);
      }
      setToastType('success');
      setModalOpen(false); setStudentToEdit(null);
      fetchStudents();
    } catch {
      setToastType('error'); setToastMessage('Operation failed. Saved to local cache.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove ${name} from the registry?`)) {
      await studentService.deleteStudent(id);
      setToastType('success');
      setToastMessage(`${name} removed from registry.`);
      fetchStudents();
    }
  };

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || (s.name?.toLowerCase().includes(q) || s.regNo?.toLowerCase().includes(q) || s.nic?.toLowerCase().includes(q) || s.idNumber?.toLowerCase().includes(q));
    const matchCourse = courseFilter === ALL_COURSES_LABEL || s.course === courseFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  return (
    <div className="page-content-container">
      <div className="page-header-row">
        <div className="page-header-titles">
          <h1><Users size={26} color="#93c5fd" />Manage Students</h1>
          <p>Complete student directory with CRUD management and 1-click letter generation</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-glass btn-glass-ghost" onClick={fetchStudents} title="Refresh">
            <RefreshCw size={15} className={loading ? 'spin-anim' : ''} /><span>Sync</span>
          </button>
          <button className="btn-glass btn-glass-primary" onClick={() => { setStudentToEdit(null); setModalOpen(true); }}>
            <UserPlus size={15} /><span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="liquid-glass-card" style={{ padding: '18px 22px', marginBottom: '22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
          <div className="glass-input-wrapper">
            <input type="text" className="glass-input with-icon" placeholder="Search by Reg No, NIC or Name..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Search size={15} className="glass-input-icon" />
          </div>
          <select className="glass-input" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            {ATI_COURSES_FILTER.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="glass-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Registration No</th>
              <th>Student Name</th>
              <th>NIC</th>
              <th>Course</th>
              <th>Started</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '44px', color: 'var(--color-text-muted)' }}>
                  No students matching your criteria.
                </td>
              </tr>
            ) : filtered.map((student) => (
              <tr key={student._id || student.regNo}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-text)', whiteSpace: 'nowrap' }}>
                  {student.regNo}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{student.name}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{student.email || ''}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{student.nic}</td>
                <td style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {student.course}
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  {student.courseStartedDate ? student.courseStartedDate.split('T')[0] : '—'}
                </td>
                <td>
                  <span className={`liquid-badge ${student.status === 'Active' ? 'success' : student.status === 'Cancelled' ? 'danger' : 'primary'}`}>
                    {student.status || 'Active'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '18px', width: '1%', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="btn-glass btn-glass-primary"
                      style={{ padding: '5px 11px', fontSize: '0.78rem' }}
                      onClick={() => navigate(`/letters?type=COURSE_FOLLOWING&studentId=${student._id}`)}
                    >
                      <FileText size={13} /><span>Letter</span>
                    </button>
                    <button
                      className="btn-glass btn-glass-ghost"
                      style={{ padding: '5px 9px' }}
                      title="Edit"
                      onClick={() => { setStudentToEdit(student); setModalOpen(true); }}
                    >
                      <Edit3 size={14} color="#60a5fa" />
                    </button>
                    <button
                      className="btn-glass btn-glass-ghost"
                      style={{ padding: '5px 9px' }}
                      title="Delete"
                      onClick={() => handleDelete(student._id, student.name)}
                    >
                      <Trash2 size={14} color="#f87171" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StudentModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setStudentToEdit(null); }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default ManageStudents;
