import React, { useState, useEffect } from 'react';
import { X, Save, User, Hash, CreditCard, Calendar, Phone } from 'lucide-react';

const ATI_COURSES = [
  'Higher National Diploma in Information Technology (HNDIT)',
  'Higher National Diploma in Business Management (HNDBM)',
  'Higher National Diploma in Accountancy (HNDA)',
  'Higher National Diploma in English (HNDE)',
  'Higher National Diploma in Agriculture (HNDAG)',
  'Higher National Diploma in Tourism & Hospitality Management (HNDTHM)',
  'Higher National Diploma in Engineering (Civil)',
  'Higher National Diploma in Engineering (Mechanical)',
  'Higher National Diploma in Engineering (Electrical)'
];

const EMPTY_FORM = () => ({
  regNo: '', nic: '', name: '', course: ATI_COURSES[0],
  idNumber: '', courseStartedDate: new Date().toISOString().split('T')[0],
  status: 'Active', email: '', phone: '',
  batch: `${new Date().getFullYear()} Full Time`
});

export const StudentModal = ({ isOpen, onClose, onSave, studentToEdit = null }) => {
  const [formData, setFormData] = useState(EMPTY_FORM());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        ...studentToEdit,
        course: studentToEdit.course || ATI_COURSES[0],
        courseStartedDate: studentToEdit.courseStartedDate ? studentToEdit.courseStartedDate.split('T')[0] : new Date().toISOString().split('T')[0],
        status: studentToEdit.status || 'Active'
      });
    } else {
      setFormData(EMPTY_FORM());
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!formData.regNo.trim()) e.regNo = 'Registration number is required';
    if (!formData.name.trim()) e.name = 'Student name is required';
    if (!formData.nic.trim()) e.nic = 'NIC number is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(formData);
  };

  const field = (f) => setFormData(prev => ({ ...prev, ...f }));
  const errStyle = { color: '#f87171', fontSize: '0.74rem', marginTop: '2px' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content liquid-glass-elevated"
        style={{ maxWidth: '620px', width: '95%', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text)' }}>
              {studentToEdit ? 'Edit Student Details' : 'Register New Student'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              ATI System Student Directory
            </p>
          </div>
          <button className="nav-toggle-btn" onClick={onClose}><X size={17} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="modal-grid-2col">
            <div className="glass-input-group">
              <label className="glass-label">Reg No *</label>
              <div className="glass-input-wrapper">
                <input type="text" required className="glass-input with-icon" placeholder="KE/IT/2023/0042"
                  value={formData.regNo} onChange={(e) => field({ regNo: e.target.value })} />
                <Hash size={14} className="glass-input-icon" />
              </div>
              {errors.regNo && <span style={errStyle}>{errors.regNo}</span>}
            </div>

            <div className="glass-input-group">
              <label className="glass-label">NIC Number *</label>
              <div className="glass-input-wrapper">
                <input type="text" required className="glass-input with-icon" placeholder="200134502891"
                  value={formData.nic} onChange={(e) => field({ nic: e.target.value })} />
                <CreditCard size={14} className="glass-input-icon" />
              </div>
              {errors.nic && <span style={errStyle}>{errors.nic}</span>}
            </div>
          </div>

          <div className="glass-input-group">
            <label className="glass-label">Full Name *</label>
            <div className="glass-input-wrapper">
              <input type="text" required className="glass-input with-icon" placeholder="Kavindu Senarathne"
                value={formData.name} onChange={(e) => field({ name: e.target.value })} />
              <User size={14} className="glass-input-icon" />
            </div>
            {errors.name && <span style={errStyle}>{errors.name}</span>}
          </div>

          <div className="glass-input-group">
            <label className="glass-label">Course of Study *</label>
            <select className="glass-input" value={formData.course} onChange={(e) => field({ course: e.target.value })}>
              {ATI_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="modal-grid-2col">
            <div className="glass-input-group">
              <label className="glass-label">Student ID Number</label>
              <div className="glass-input-wrapper">
                <input type="text" className="glass-input with-icon" placeholder="ATI-IT-23-042"
                  value={formData.idNumber} onChange={(e) => field({ idNumber: e.target.value })} />
                <Hash size={14} className="glass-input-icon" />
              </div>
            </div>

            <div className="glass-input-group">
              <label className="glass-label">Course Started Date</label>
              <div className="glass-input-wrapper">
                <input type="date" className="glass-input with-icon" value={formData.courseStartedDate}
                  onChange={(e) => field({ courseStartedDate: e.target.value })} />
                <Calendar size={14} className="glass-input-icon" />
              </div>
            </div>
          </div>

          <div className="modal-grid-2col">
            <div className="glass-input-group">
              <label className="glass-label">Status</label>
              <select className="glass-input" value={formData.status} onChange={(e) => field({ status: e.target.value })}>
                <option value="Active">Active (Following)</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="glass-input-group">
              <label className="glass-label">Email Address</label>
              <div className="glass-input-wrapper">
                <input type="email" className="glass-input" placeholder="student@ati.edu.lk"
                  value={formData.email} onChange={(e) => field({ email: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="glass-input-group">
            <label className="glass-label">Phone Number</label>
            <div className="glass-input-wrapper">
              <input type="tel" className="glass-input with-icon" placeholder="+94 77 123 4567"
                value={formData.phone} onChange={(e) => field({ phone: e.target.value })} />
              <Phone size={14} className="glass-input-icon" />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '10px',
            marginTop: '12px', paddingTop: '16px',
            borderTop: '1px solid var(--color-border)'
          }}>
            <button type="button" className="btn-glass btn-glass-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-glass btn-glass-primary">
              <Save size={15} />
              <span>{studentToEdit ? 'Save Changes' : 'Register Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
