import React, { useState, useEffect } from 'react';
import { Archive, Search, Eye } from 'lucide-react';
import letterService from '../services/letterService';
import LetterPreviewModal from '../components/LetterPreviewModal';
import Toast from '../components/Toast';

export const LetterArchive = () => {
  const [letters, setLetters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState({ type: 'COURSE_FOLLOWING', data: {} });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => { setLetters(letterService.getLetterHistory()); }, []);

  const handleOpenPreview = (letter) => {
    setSelectedLetter({
      type: letter.type,
      data: {
        refNo: letter.refNo, name: letter.studentName || letter.name,
        regNo: letter.regNo, nic: letter.nic, idNumber: letter.idNumber,
        course: letter.course, courseStartedDate: letter.courseStartedDate
      }
    });
    setPreviewOpen(true);
  };

  const filtered = letters.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || (l.refNo?.toLowerCase().includes(q) || l.regNo?.toLowerCase().includes(q) || l.studentName?.toLowerCase().includes(q) || l.name?.toLowerCase().includes(q));
    const matchType = typeFilter === 'ALL' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="page-content-container">
      <div className="page-header-row">
        <div className="page-header-titles">
          <h1><Archive size={26} color="#93c5fd" />Letters Archive</h1>
          <p>Historical record of all issued letters — Course Following, Confirmations, and Cancellations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="liquid-glass-card" style={{ padding: '18px 22px', marginBottom: '22px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="glass-input-wrapper">
            <input type="text" className="glass-input with-icon" placeholder="Search by Ref No, Student Name or Reg No..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Search size={15} className="glass-input-icon" />
          </div>
          <select className="glass-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="ALL">All Document Types</option>
            <option value="COURSE_FOLLOWING">Course Following Letters</option>
            <option value="STUDENTSHIP_CONFIRMATION">Studentship Confirmations</option>
            <option value="REGISTRATION_CANCELLATION">Registration Cancellations</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Document Type</th>
              <th>Student & Reg No</th>
              <th>Course</th>
              <th>Date Issued</th>
              <th style={{ textAlign: 'right', paddingRight: '18px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '44px', color: 'var(--color-text-muted)' }}>
                  No issued letters found.
                </td>
              </tr>
            ) : filtered.map((letter) => (
              <tr key={letter.id || letter.refNo}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-text)', whiteSpace: 'nowrap' }}>
                  {letter.refNo}
                </td>
                <td>
                  <span className={`liquid-badge ${letter.type === 'COURSE_FOLLOWING' ? 'primary' : letter.type === 'STUDENTSHIP_CONFIRMATION' ? 'purple' : 'danger'}`}>
                    {letter.type === 'COURSE_FOLLOWING' ? 'Course Following' : letter.type === 'STUDENTSHIP_CONFIRMATION' ? 'Studentship Confirm' : 'Reg. Cancellation'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{letter.studentName || letter.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{letter.regNo}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {letter.course}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(letter.generatedAt || Date.now()).toLocaleDateString('en-GB')}
                </td>
                <td style={{ textAlign: 'right', paddingRight: '18px', whiteSpace: 'nowrap', width: '1%' }}>
                  <button className="btn-glass btn-glass-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleOpenPreview(letter)}>
                    <Eye size={13} /><span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LetterPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)}
        letterType={selectedLetter.type} studentData={selectedLetter.data}
        onGeneratedSuccess={() => setToastMessage('Document exported successfully!')} />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default LetterArchive;
