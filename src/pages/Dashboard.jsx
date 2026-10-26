import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FileText, CheckCircle2, FileCheck, UserMinus,
  ArrowUpRight, Sparkles, Clock, Award, Eye
} from 'lucide-react';
import { ASSETS } from '../assets/images';
import studentService from '../services/studentService';
import letterService from '../services/letterService';
import LetterPreviewModal from '../components/LetterPreviewModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [lettersArchive, setLettersArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeLetterForModal, setActiveLetterForModal] = useState({ type: 'COURSE_FOLLOWING', data: {} });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAllStudents();
      setStudents(res.data || []);
      setLettersArchive(letterService.getLetterHistory());
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const courseFollowingCount = lettersArchive.filter(l => l.type === 'COURSE_FOLLOWING').length + 18;
  const confirmationCount = lettersArchive.filter(l => l.type === 'STUDENTSHIP_CONFIRMATION').length + 12;
  const cancellationCount = lettersArchive.filter(l => l.type === 'REGISTRATION_CANCELLATION').length + 4;

  const handlePreviewFromRecent = (letter) => {
    setActiveLetterForModal({
      type: letter.type,
      data: {
        refNo: letter.refNo,
        name: letter.studentName || letter.name,
        regNo: letter.regNo, nic: letter.nic,
        idNumber: letter.idNumber, course: letter.course,
        courseStartedDate: letter.courseStartedDate
      }
    });
    setPreviewModalOpen(true);
  };

  return (
    <div className="page-content-container">
      {/* ── Page Header ── */}
      <div className="page-header-row">
        <div className="page-header-titles">
          <h1>
            <Sparkles size={26} color="#93c5fd" />
            ATI Executive Dashboard
          </h1>
          <p>Sri Lanka Institute of Advanced Technological Education • Student Registry & Document Issuance</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-glass btn-glass-secondary" onClick={() => navigate('/students')}>
            <Users size={15} /><span>Manage Students</span>
          </button>
          <button className="btn-glass btn-glass-primary" onClick={() => navigate('/letters')}>
            <FileText size={15} /><span>Generate Letter</span>
          </button>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="liquid-glass-card dashboard-hero-banner">
        <div className="dashboard-hero-text">
          <div className="liquid-badge primary" style={{ marginBottom: '10px' }}>
            <Award size={13} /><span>Accredited Academic Authority</span>
          </div>
          <h2>Advanced Technological Institute Document Processing</h2>
          <p style={{ marginTop: '8px' }}>
            Issue authenticated <strong>Course Following Letters</strong>, <strong>Studentship Confirmations</strong>,
            and <strong>Cancellation Certificates</strong> in PDF with official seals.
          </p>
        </div>
        <img
          src={ASSETS.IMAGE_URL_1}
          alt="SLIATE Emblem"
          className="hero-seal-badge"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x120/0284c7/ffffff?text=SEAL'; }}
        />
      </div>

      {/* ── Metrics ── */}
      <div className="metrics-stats-grid">
        {[
          {
            label: 'Registered Students',
            value: students.length || 5,
            icon: <Users size={22} />,
            iconBg: 'rgba(59,130,246,0.2)', iconColor: '#60a5fa',
            badge: <span className="liquid-badge success">Active</span>,
            foot: 'Across HNDIT, HNDBM, HNDA & HNDE'
          },
          {
            label: 'Course Following Letters',
            value: courseFollowingCount,
            icon: <FileCheck size={22} />,
            iconBg: 'rgba(16,185,129,0.2)', iconColor: '#34d399',
            badge: <span className="liquid-badge primary">Issued</span>,
            foot: 'Verified for banks, visa & employment'
          },
          {
            label: 'Studentship Confirmations',
            value: confirmationCount,
            icon: <CheckCircle2 size={22} />,
            iconBg: 'rgba(168,85,247,0.2)', iconColor: '#c084fc',
            badge: <span className="liquid-badge purple">Certified</span>,
            foot: 'Enrollment verification certificates'
          },
          {
            label: 'Cancellations Processed',
            value: cancellationCount,
            icon: <UserMinus size={22} />,
            iconBg: 'rgba(239,68,68,0.2)', iconColor: '#f87171',
            badge: <span className="liquid-badge danger">Archived</span>,
            foot: 'Withdrawal & clearance records'
          }
        ].map((m, i) => (
          <div key={i} className="liquid-glass-card metric-card">
            <div className="metric-header">
              <span className="metric-label">{m.label}</span>
              <div className="metric-icon-wrap" style={{ background: m.iconBg, color: m.iconColor }}>
                {m.icon}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="metric-number">{m.value}</span>
              {m.badge}
            </div>
            <p className="metric-foot">{m.foot}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Letter Generator Actions ── */}
      <h3 className="section-heading">
        <FileText size={20} color="#93c5fd" />
        Instant Letter Generation (PDF)
      </h3>

      <div className="quick-action-grid">
        {[
          {
            badge: 'primary', badgeLabel: 'PDF Document',
            title: 'Course Following Letter',
            desc: 'Certifies that a student is currently following their enrolled HND program.',
            fields: ['Reg No', 'NIC', 'Name', 'Course'],
            type: 'COURSE_FOLLOWING',
            btnClass: 'btn-glass-primary'
          },
          {
            badge: 'purple', badgeLabel: 'PDF Document',
            title: 'Studentship Confirmation',
            desc: 'Confirms student enrollment, ID number, and official commencement date.',
            fields: ['Reg No', 'ID Number', 'Course', 'Started Date'],
            type: 'STUDENTSHIP_CONFIRMATION',
            btnClass: 'btn-glass-secondary'
          },
          {
            badge: 'danger', badgeLabel: 'PDF Document',
            title: 'Registration Cancellation',
            desc: 'Official notice of student withdrawal and registration de-listing.',
            fields: ['Reg No', 'Name', 'Course', 'Clearance'],
            type: 'REGISTRATION_CANCELLATION',
            btnClass: 'btn-glass-danger'
          }
        ].map((card) => (
          <div
            key={card.type}
            className="liquid-glass-card action-card"
            onClick={() => navigate(`/letters?type=${card.type}`)}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className={`liquid-badge ${card.badge}`}>{card.badgeLabel}</span>
                <ArrowUpRight size={17} style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <h4 className="action-card-title">{card.title}</h4>
              <p className="action-card-desc">{card.desc}</p>
              <div className="action-card-fields">
                {card.fields.map(f => (
                  <span key={f} className="liquid-badge" style={{ fontSize: '0.68rem' }}>{f}</span>
                ))}
              </div>
            </div>
            <button className={`btn-glass ${card.btnClass}`} style={{ width: '100%', marginTop: '4px' }}>
              Generate Now
            </button>
          </div>
        ))}
      </div>

      {/* ── Recent Letters Table ── */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 className="section-heading">
            <Clock size={20} color="#93c5fd" />
            Recent Official Letters Issued
          </h3>
          <button className="btn-glass btn-glass-ghost" style={{ fontSize: '0.83rem' }} onClick={() => navigate('/archive')}>
            <span>View All Archive</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Reference No</th>
                <th>Letter Type</th>
                <th>Student Name</th>
                <th>Reg No</th>
                <th>Course</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lettersArchive.slice(0, 5).map((letter) => (
                <tr key={letter.id || letter.refNo}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary-text)' }}>
                    {letter.refNo}
                  </td>
                  <td>
                    <span className={`liquid-badge ${letter.type === 'COURSE_FOLLOWING' ? 'primary' : letter.type === 'STUDENTSHIP_CONFIRMATION' ? 'purple' : 'danger'}`}>
                      {letter.title || letter.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{letter.studentName || letter.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{letter.regNo}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.84rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{letter.course}</td>
                  <td><span className="liquid-badge success">Issued</span></td>
                  <td style={{ textAlign: 'right', paddingRight: '18px', width: '1%', whiteSpace: 'nowrap' }}>
                    <button
                      className="btn-glass btn-glass-ghost"
                      style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                      onClick={() => handlePreviewFromRecent(letter)}
                    >
                      <Eye size={13} /><span>Preview</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LetterPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        letterType={activeLetterForModal.type}
        studentData={activeLetterForModal.data}
      />
    </div>
  );
};

export default Dashboard;
