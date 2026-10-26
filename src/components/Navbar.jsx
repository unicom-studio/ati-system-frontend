import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, FileText, LogOut, User, Archive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export const Navbar = ({ toggleSidebar, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="liquid-navbar">
      <div className="nav-left-section">
        <button
          className="nav-toggle-btn"
          onClick={toggleSidebar}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearch} className="nav-search-box">
          <Search size={15} className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search by Reg No, NIC, Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="nav-right-section">
        {/* Dark / Light Mode Toggle */}
        <ThemeToggle showLabel={false} />

        {/* API Connection Indicator */}
        <div className="nav-status-indicator" title="Connected to MERN Backend API">
          <span className="nav-status-dot" />
          <span>API Active</span>
        </div>

        {/* New Letter Button */}
        <button
          className="btn-glass btn-glass-primary"
          style={{ padding: '7px 14px', fontSize: '0.83rem' }}
          onClick={() => navigate('/letters')}
        >
          <FileText size={15} />
          <span>New Letter</span>
        </button>

        {/* User Account Capsule */}
        <div style={{ position: 'relative' }}>
          <div className="nav-user-badge" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar-circle">
              {user?.avatar || (user?.name?.[0] ?? 'A').toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span className="nav-user-name">{user?.name || 'Administrator'}</span>
              <span className="nav-user-role">{user?.role || 'Academic Staff'}</span>
            </div>
          </div>

          {dropdownOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setDropdownOpen(false)}
              />
              <div
                className="liquid-glass-elevated"
                style={{
                  position: 'absolute', right: 0, top: '48px',
                  width: '220px', padding: '10px', zIndex: 99,
                  display: 'flex', flexDirection: 'column', gap: '4px',
                }}
              >
                <div style={{
                  padding: '8px 10px', marginBottom: '4px',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Logged in as</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {user?.email || 'admin@ati.edu.lk'}
                  </p>
                </div>

                <button
                  className="btn-glass btn-glass-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.84rem' }}
                  onClick={() => { setDropdownOpen(false); navigate('/students'); }}
                >
                  <User size={14} />
                  <span>Student Directory</span>
                </button>

                <button
                  className="btn-glass btn-glass-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.84rem' }}
                  onClick={() => { setDropdownOpen(false); navigate('/archive'); }}
                >
                  <Archive size={14} />
                  <span>Letters Archive</span>
                </button>

                <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />

                <button
                  className="btn-glass btn-glass-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.84rem', color: '#f87171' }}
                  onClick={() => { setDropdownOpen(false); logout(); navigate('/login'); }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
