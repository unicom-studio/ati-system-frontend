import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LetterGenerator from './pages/LetterGenerator';
import ManageStudents from './pages/ManageStudents';
import LetterArchive from './pages/LetterArchive';
import Login from './pages/Login';
import './App.css';
import './assets/liquid-glass.css';

// Detects mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

// Main App Layout Wrapper
const MainLayout = ({ children }) => {
  const isMobile = useIsMobile();
  // Desktop: collapsed = icon-only sidebar. Mobile: open = drawer visible
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="app-container">
      {/* Ambient Blobs */}
      <div className="ambient-blobs-container">
        <div className="ambient-blob ambient-blob-1" />
        <div className="ambient-blob ambient-blob-2" />
        <div className="ambient-blob ambient-blob-3" />
      </div>

      {/* Mobile overlay — tap to close sidebar */}
      {isMobile && mobileOpen && (
        <div
          className="sidebar-mobile-overlay visible"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={isMobile ? false : sidebarCollapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="main-content-wrapper">
        <Navbar
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={isMobile ? !mobileOpen : sidebarCollapsed}
        />
        <main>{children}</main>
      </div>
    </div>
  );
};

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/letters" element={<ProtectedRoute><LetterGenerator /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute><LetterArchive /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
