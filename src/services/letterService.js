import api from './api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LETTERS_STORAGE_KEY = 'ati_letters_archive';

const DEFAULT_ARCHIVE = [
  {
    id: 'LET-2026-001',
    refNo: 'ATI/SLIATE/GEN/2026/089',
    type: 'COURSE_FOLLOWING',
    title: 'Course Following Letter',
    studentName: 'Kavindu Senarathne',
    regNo: 'KE/IT/2023/0042',
    nic: '200134502891',
    course: 'Higher National Diploma in Information Technology (HNDIT)',
    generatedAt: '2026-10-24T14:30:00Z',
    status: 'Issued'
  },
  {
    id: 'LET-2026-002',
    refNo: 'ATI/SLIATE/CONF/2026/045',
    type: 'STUDENTSHIP_CONFIRMATION',
    title: 'Studentship Confirmation Letter',
    studentName: 'Nethmi Fernando',
    regNo: 'KE/BM/2023/0018',
    idNumber: 'ATI-BM-23-018',
    course: 'Higher National Diploma in Business Management (HNDBM)',
    courseStartedDate: '2023-02-15',
    generatedAt: '2026-10-25T09:15:00Z',
    status: 'Issued'
  }
];

export const letterService = {
  // Call backend letter generation endpoint via Axios
  generateLetterBackend: async (letterPayload) => {
    try {
      const response = await api.post('/letters/generate', letterPayload);
      return { success: true, data: response.data, source: 'backend' };
    } catch {
      // Local fallback generation
      const letterRecord = {
        id: 'LET-' + Date.now(),
        refNo: `ATI/SLIATE/${letterPayload.type.substring(0, 4)}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        generatedAt: new Date().toISOString(),
        status: 'Issued',
        ...letterPayload,
      };
      letterService.saveLetterToHistory(letterRecord);
      return { success: true, data: letterRecord, source: 'local' };
    }
  },

  // Save generated letter record to archive
  saveLetterToHistory: (letter) => {
    const history = letterService.getLetterHistory();
    const exists = history.some(item => item.id === letter.id);
    const updated = exists ? history.map(item => item.id === letter.id ? letter : item) : [letter, ...history];
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Get letter generation archive
  getLetterHistory: () => {
    const data = localStorage.getItem(LETTERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(DEFAULT_ARCHIVE));
      return DEFAULT_ARCHIVE;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_ARCHIVE;
    }
  },

  // High-Resolution Client-Side PDF Export using html2canvas & jsPDF
  downloadLetterPdf: async (elementId, filename = 'ATI-Official-Letter.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution retina scale
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
      return true;
    } catch (err) {
      console.error('Client PDF generation error:', err);
      // Fallback: Trigger standard native print
      window.print();
      return false;
    }
  },

  // Print letter directly
  printLetter: () => {
    window.print();
  }
};

export default letterService;
