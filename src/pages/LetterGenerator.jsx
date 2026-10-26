import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText, Download, Printer, Eye, Sparkles, CheckCircle2, AlertCircle,
  Hash, CreditCard, User, Calendar
} from 'lucide-react';
import studentService from '../services/studentService';
import letterService from '../services/letterService';
import LetterDocument from '../components/LetterDocument';
import LetterPreviewModal from '../components/LetterPreviewModal';
import Toast from '../components/Toast';

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

export const LetterGenerator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get('type') || 'COURSE_FOLLOWING';
  const initialStudentId = searchParams.get('studentId');

  const [activeTab, setActiveTab] = useState(initialType);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    regNo: 'KE/IT/2023/0042', nic: '200134502891', name: 'Kavindu Senarathne',
    course: ATI_COURSES[0], idNumber: 'ATI-IT-23-042',
    courseStartedDate: '2023-02-15',
    refNo: `ATI/SLIATE/GEN/${new Date().getFullYear()}/042`
  });

  const [downloading, setDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  useEffect(() => { loadStudents(); }, []);
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl && ['COURSE_FOLLOWING', 'STUDENTSHIP_CONFIRMATION', 'REGISTRATION_CANCELLATION'].includes(typeFromUrl)) {
      setActiveTab(typeFromUrl);
    }
  }, [searchParams]);

  const loadStudents = async () => {
    const res = await studentService.getAllStudents();
    const list = res.data || [];
    setStudentsList(list);
    if (initialStudentId) {
      const matched = list.find(s => s._id === initialStudentId || s.regNo === initialStudentId);
      if (matched) { populateFromStudent(matched); setSelectedStudentId(matched._id); }
    }
  };

  const populateFromStudent = (student) => {
    if (!student) return;
    setFormData(prev => ({
      ...prev,
      regNo: student.regNo || '',
      nic: student.nic || '',
      name: student.name || '',
      course: student.course || ATI_COURSES[0],
      idNumber: student.idNumber || '',
      courseStartedDate: student.courseStartedDate ? student.courseStartedDate.split('T')[0] : '2023-02-15',
      refNo: `ATI/SLIATE/${activeTab.substring(0, 4)}/${new Date().getFullYear()}/${student.regNo ? student.regNo.replace(/[^0-9]/g, '').slice(-3) || '101' : '101'}`
    }));
  };

  const handleStudentSelect = (e) => {
    const id = e.target.value;
    setSelectedStudentId(id);
    const found = studentsList.find(s => s._id === id);
    if (found) populateFromStudent(found);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ type: tab });
    setFormData(prev => ({ ...prev, refNo: `ATI/SLIATE/${tab.substring(0, 4)}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}` }));
  };

  const handleGeneratePdf = async () => {
    setDownloading(true);
    try {
      await letterService.generateLetterBackend({ type: activeTab, ...formData });
      const filename = `ATI_${activeTab}_${formData.regNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      await letterService.downloadLetterPdf('live-preview-letter', filename);
      setToastType('success');
      setToastMessage('Official letter generated and downloaded successfully!');
    } catch {
      setToastType('info');
      setToastMessage('Document exported via print fallback.');
    } finally {
      setDownloading(false);
    }
  };

  const tabDefs = [
    { id: 'COURSE_FOLLOWING', icon: <FileText size={15} />, label: '1. Course Following' },
    { id: 'STUDENTSHIP_CONFIRMATION', icon: <CheckCircle2 size={15} />, label: '2. Studentship Confirmation' },
    { id: 'REGISTRATION_CANCELLATION', icon: <AlertCircle size={15} />, label: '3. Registration Cancellation' }
  ];

  return (
    <div className="page-content-container">
      {/* Header */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <h1><FileText size={26} color="#93c5fd" />ATI Letter Generator</h1>
          <p>Generate and export authenticated PDF letters for official SLIATE use</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-glass btn-glass-secondary" onClick={() => setIsModalOpen(true)}>
            <Eye size={15} /><span>Full Preview</span>
          </button>
          <button className="btn-glass btn-glass-primary" onClick={handleGeneratePdf} disabled={downloading}>
            <Download size={15} /><span>{downloading ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Letter Tabs */}
      <div className="letter-tabs-nav">
        {tabDefs.map(t => (
          <button
            key={t.id}
            className={`letter-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => handleTabChange(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Split View */}
      <div className="generator-layout">
        {/* Form Panel */}
        <div className="liquid-glass-card generator-form-panel">
          {/* Student Autofill */}
          <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
            <label className="glass-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={13} color="#60a5fa" />
              Autofill from Registered Students (Optional)
            </label>
            <select className="glass-input" value={selectedStudentId} onChange={handleStudentSelect}>
              <option value="">-- Choose student to auto-populate --</option>
              {studentsList.map((std) => (
                <option key={std._id} value={std._id}>
                  {std.regNo} — {std.name}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
            {activeTab === 'COURSE_FOLLOWING' ? 'Course Following Letter' :
              activeTab === 'STUDENTSHIP_CONFIRMATION' ? 'Studentship Confirmation Letter' :
                'Registration Cancellation Letter'} — Required Particulars
          </h3>

          <form onSubmit={(e) => { e.preventDefault(); handleGeneratePdf(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Course Following */}
            {activeTab === 'COURSE_FOLLOWING' && (<>
              <div className="glass-input-group">
                <label className="glass-label">Registration Number *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. KE/IT/2023/0042"
                    value={formData.regNo} onChange={(e) => setFormData({ ...formData, regNo: e.target.value })} />
                  <Hash size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">NIC Number *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. 200134502891"
                    value={formData.nic} onChange={(e) => setFormData({ ...formData, nic: e.target.value })} />
                  <CreditCard size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Student Full Name *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. Kavindu Senarathne"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <User size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Course of Study *</label>
                <select className="glass-input" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}>
                  {ATI_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>)}

            {/* Studentship Confirmation */}
            {activeTab === 'STUDENTSHIP_CONFIRMATION' && (<>
              <div className="glass-input-group">
                <label className="glass-label">Registration Number *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. KE/BM/2023/0018"
                    value={formData.regNo} onChange={(e) => setFormData({ ...formData, regNo: e.target.value })} />
                  <Hash size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Student ID Number *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. ATI-BM-23-018"
                    value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
                  <CreditCard size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Student Name (Optional)</label>
                <div className="glass-input-wrapper">
                  <input type="text" className="glass-input with-icon" placeholder="e.g. Nethmi Fernando"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <User size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Enrolled Course *</label>
                <select className="glass-input" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}>
                  {ATI_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Course Started Date *</label>
                <div className="glass-input-wrapper">
                  <input type="date" required className="glass-input with-icon" value={formData.courseStartedDate}
                    onChange={(e) => setFormData({ ...formData, courseStartedDate: e.target.value })} />
                  <Calendar size={15} className="glass-input-icon" />
                </div>
              </div>
            </>)}

            {/* Registration Cancellation */}
            {activeTab === 'REGISTRATION_CANCELLATION' && (<>
              <div className="glass-input-group">
                <label className="glass-label">Registration Number *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. KE/IT/2022/0014"
                    value={formData.regNo} onChange={(e) => setFormData({ ...formData, regNo: e.target.value })} />
                  <Hash size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Student Name *</label>
                <div className="glass-input-wrapper">
                  <input type="text" required className="glass-input with-icon" placeholder="e.g. Sachintha Perera"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <User size={15} className="glass-input-icon" />
                </div>
              </div>
              <div className="glass-input-group">
                <label className="glass-label">Registered Course *</label>
                <select className="glass-input" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}>
                  {ATI_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>)}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
              <button type="button" className="btn-glass btn-glass-secondary" style={{ flex: 1 }} onClick={() => window.print()}>
                <Printer size={15} /><span>Print</span>
              </button>
              <button type="submit" className="btn-glass btn-glass-primary" style={{ flex: 1 }} disabled={downloading}>
                <Download size={15} /><span>{downloading ? 'Processing...' : 'Download PDF'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} color="#34d399" />
              Live Document Preview (SLIATE Standard)
            </span>
            <button className="btn-glass btn-glass-ghost" style={{ fontSize: '0.78rem', padding: '4px 10px' }} onClick={() => setIsModalOpen(true)}>
              <Eye size={13} /><span>Enlarge</span>
            </button>
          </div>
          <LetterDocument documentId="live-preview-letter" letterType={activeTab} studentData={formData} />
        </div>
      </div>

      <LetterPreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} letterType={activeTab} studentData={formData}
        onGeneratedSuccess={() => { setToastType('success'); setToastMessage('Document generated and exported!'); }} />

      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default LetterGenerator;
