import React from 'react';
import { ASSETS } from '../assets/images';

export const LetterDocument = ({ 
  letterType = 'COURSE_FOLLOWING', 
  studentData = {}, 
  documentId = 'printable-letter-document' 
}) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const refNumber = studentData.refNo || `ATI/SLIATE/${letterType.substring(0, 4)}/${new Date().getFullYear()}/${studentData.regNo ? studentData.regNo.replace(/[^a-zA-Z0-9]/g, '') : '001'}`;

  return (
    <div 
      id={documentId} 
      className="letter-preview-sheet"
    >
      <div>
        {/* Official Letterhead Header */}
        <div className="letterhead-header">
          <img 
            src={ASSETS.LOGO_IMAGE} 
            alt="ATI Emblem" 
            className="letterhead-logo" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/1e293b/ffffff?text=ATI';
            }}
          />

          <div className="letterhead-center-text">
            <p className="institute-gov-title">
              Ministry of Education • Sri Lanka
            </p>
            <h1 className="institute-main-name">
              Advanced Technological Institute
            </h1>
            <p className="institute-sub-text">
              Sri Lanka Institute of Advanced Technological Education (SLIATE)
            </p>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              Tel: +94 11 269 1572 | Web: www.sliate.ac.lk | Email: info@ati.edu.lk
            </p>
          </div>

          <img 
            src={ASSETS.IMAGE_URL_1} 
            alt="Official Seal" 
            className="letterhead-seal" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/0284c7/ffffff?text=SEAL';
            }}
          />
        </div>

        {/* Reference and Date Strip */}
        <div className="letter-meta-strip">
          <div>
            <span>My Ref: </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{refNumber}</span>
          </div>
          <div>
            <span>Date: </span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>To Whom It May Concern,</p>
        </div>

        {/* =========================================================
            Letter Variant 1: Course Following Letter
            Requirements: Reg No, NIC, Name, Course
            ========================================================= */}
        {letterType === 'COURSE_FOLLOWING' && (
          <>
            <h2 className="letter-subject-title">
              CONFIRMATION OF COURSE FOLLOWING STATUS
            </h2>

            <div className="letter-body-content">
              <p>
                This is to officially certify that the student whose particulars are stated below is a bonafide student who is currently following the designated academic program at the Advanced Technological Institute (ATI), Sri Lanka Institute of Advanced Technological Education (SLIATE).
              </p>

              <table className="letter-details-table">
                <tbody>
                  <tr>
                    <td>Full Name:</td>
                    <td><strong>{studentData.name || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Student Registration No:</td>
                    <td><strong>{studentData.regNo || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>National Identity Card (NIC):</td>
                    <td><strong>{studentData.nic || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Course of Study:</td>
                    <td><strong>{studentData.course || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Current Status:</td>
                    <td><span style={{ color: '#047857', fontWeight: 'bold' }}>Actively Following (Full-Time)</span></td>
                  </tr>
                </tbody>
              </table>

              <p>
                The medium of instruction for the aforementioned course is English. During the period of study, the student has maintained satisfactory attendance and conduct in compliance with the rules and regulations of the institute.
              </p>

              <p>
                This certificate is issued upon the request of the student for official verification and academic/employment administrative purposes.
              </p>
            </div>
          </>
        )}

        {/* =========================================================
            Letter Variant 2: StudentShip Confirmation Letter
            Requirements: Reg No, ID Number, Course, Course Started Date
            ========================================================= */}
        {letterType === 'STUDENTSHIP_CONFIRMATION' && (
          <>
            <h2 className="letter-subject-title">
              STUDENTSHIP CONFIRMATION LETTER
            </h2>

            <div className="letter-body-content">
              <p>
                This is to confirm and verify that the undermentioned individual is duly registered and enrolled as a student of the Advanced Technological Institute (ATI), administered under the Sri Lanka Institute of Advanced Technological Education (SLIATE).
              </p>

              <table className="letter-details-table">
                <tbody>
                  <tr>
                    <td>Registration Number:</td>
                    <td><strong>{studentData.regNo || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Student ID Number:</td>
                    <td><strong>{studentData.idNumber || 'N/A'}</strong></td>
                  </tr>
                  {studentData.name && (
                    <tr>
                      <td>Student Name:</td>
                      <td><strong>{studentData.name}</strong></td>
                    </tr>
                  )}
                  <tr>
                    <td>Enrolled Course:</td>
                    <td><strong>{studentData.course || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Course Started Date:</td>
                    <td><strong>{studentData.courseStartedDate || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Institutional Standing:</td>
                    <td><span style={{ color: '#0284c7', fontWeight: 'bold' }}>Valid & In Good Standing</span></td>
                  </tr>
                </tbody>
              </table>

              <p>
                The student continues to be governed by the standard statutes, bylaws, and assessment regulations set forth by the Academic Board of SLIATE.
              </p>

              <p>
                Please feel free to contact the Academic Affairs Division of the Advanced Technological Institute should any further authentication or particulars be required.
              </p>
            </div>
          </>
        )}

        {/* =========================================================
            Letter Variant 3: Registration Cancellation Letter
            Requirements: Reg No, Name, Course
            ========================================================= */}
        {letterType === 'REGISTRATION_CANCELLATION' && (
          <>
            <h2 className="letter-subject-title" style={{ color: '#991b1b' }}>
              REGISTRATION CANCELLATION LETTER
            </h2>

            <div className="letter-body-content">
              <p>
                This document serves as formal institutional notice that the student registration detailed below has been officially cancelled and struck off the institutional registry of the Advanced Technological Institute (ATI), SLIATE.
              </p>

              <table className="letter-details-table">
                <tbody>
                  <tr>
                    <td>Student Name:</td>
                    <td><strong>{studentData.name || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Registration Number:</td>
                    <td><strong>{studentData.regNo || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Course of Study:</td>
                    <td><strong>{studentData.course || 'N/A'}</strong></td>
                  </tr>
                  <tr>
                    <td>Cancellation Status:</td>
                    <td><span style={{ color: '#b91c1c', fontWeight: 'bold' }}>Registration Terminated / Cancelled</span></td>
                  </tr>
                  <tr>
                    <td>Clearance Clearance:</td>
                    <td>Completed (Library, Laboratory & Academic dues cleared)</td>
                  </tr>
                </tbody>
              </table>

              <p>
                Following the cancellation of student registration, the student is no longer permitted to sit for term-end examinations, receive course credits, or represent the institute in any official capacity.
              </p>

              <p>
                Original educational certificates submitted during admission have been handed back upon submission of the clearance form.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Official Signatures, Seal & Authority Block */}
      <div>
        <div className="letter-footer-signatures">
          <div className="official-seal-box">
            <div className="official-stamp-circle">
              SLIATE<br />
              OFFICIAL SEAL<br />
              ATI KEGALLE
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Institutional Stamp</span>
          </div>

          <div className="signatory-box">
            <div className="signature-line"></div>
            <p className="signatory-name">Dr. N. K. Rajapaksa</p>
            <p className="signatory-designation">Director / Academic Registrar</p>
            <p className="signatory-designation">Advanced Technological Institute</p>
          </div>
        </div>

        {/* Security Barcode & Tracking strip */}
        <div className="letter-security-footer">
          <span>Security Verification ID: <strong>{refNumber}</strong></span>
          <span>System Generated Official Document • SLIATE ATI</span>
          <span>Valid without signature alteration</span>
        </div>
      </div>
    </div>
  );
};

export default LetterDocument;
