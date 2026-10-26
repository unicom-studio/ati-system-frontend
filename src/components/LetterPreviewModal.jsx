import React, { useState } from 'react';
import { X, Download, Printer, Copy, Check, FileText } from 'lucide-react';
import LetterDocument from './LetterDocument';
import letterService from '../services/letterService';

export const LetterPreviewModal = ({ 
  isOpen, 
  onClose, 
  letterType, 
  studentData, 
  onGeneratedSuccess 
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = `ATI_${letterType}_${studentData.regNo ? studentData.regNo.replace(/[^a-zA-Z0-9]/g, '_') : 'Letter'}.pdf`;
      await letterService.downloadLetterPdf('modal-printable-letter', filename);
      if (onGeneratedSuccess) {
        onGeneratedSuccess();
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `ATI SLIATE Official Letter\nType: ${letterType}\nStudent: ${studentData.name || 'N/A'}\nReg No: ${studentData.regNo || 'N/A'}\nCourse: ${studentData.course || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content liquid-glass-elevated" 
        style={{ 
          maxWidth: '880px', 
          width: '95%', 
          maxHeight: '92vh',
          padding: '24px 28px',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-preview-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="liquid-badge primary">
              <FileText size={15} />
              <span>Official Document</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {letterType === 'COURSE_FOLLOWING' && 'Course Following Letter'}
              {letterType === 'STUDENTSHIP_CONFIRMATION' && 'Studentship Confirmation Letter'}
              {letterType === 'REGISTRATION_CANCELLATION' && 'Registration Cancellation Letter'}
            </h3>
          </div>

          <div className="modal-action-buttons">
            <button 
              className="btn-glass btn-glass-ghost" 
              onClick={handleCopy}
              title="Copy text particulars"
              style={{ padding: '8px 12px' }}
            >
              {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
              <span style={{ fontSize: '0.82rem' }}>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button 
              className="btn-glass btn-glass-secondary" 
              onClick={handlePrint}
              style={{ padding: '8px 14px' }}
            >
              <Printer size={15} />
              <span style={{ fontSize: '0.82rem' }}>Print</span>
            </button>

            <button 
              className="btn-glass btn-glass-primary" 
              onClick={handleDownload}
              disabled={downloading}
              style={{ padding: '8px 16px' }}
            >
              <Download size={15} />
              <span style={{ fontSize: '0.82rem' }}>
                {downloading ? 'Exporting...' : 'Download PDF'}
              </span>
            </button>

            <button 
              className="nav-toggle-btn" 
              onClick={onClose}
              style={{ width: '36px', height: '36px' }}
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* High-Resolution Printable Document Sheet */}
        <div style={{ overflowX: 'auto', padding: '4px', margin: '14px 0' }}>
          <LetterDocument
            documentId="modal-printable-letter"
            letterType={letterType}
            studentData={studentData}
          />
        </div>

        {/* Modal Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: '16px', 
          paddingTop: '14px', 
          borderTop: '1px solid var(--color-border)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Standard SLIATE format with institutional seal, signature & watermark
          </span>
          <button className="btn-glass btn-glass-ghost" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterPreviewModal;
