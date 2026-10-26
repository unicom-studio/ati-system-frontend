import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, Archive, GraduationCap
} from 'lucide-react';
import { ASSETS } from '../assets/images';
import ThemeToggle from './ThemeToggle';

export const Sidebar = ({ collapsed, mobileOpen, isMobile }) => {
  return (
    <aside className={`liquid-sidebar ${collapsed ? 'collapsed' : ''} ${isMobile && mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <img
          src={ASSETS.LOGO_IMAGE}
          alt="ATI Logo"
          className="brand-logo-img"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/1e293b/93c5fd?text=ATI'; }}
        />
        {!collapsed && (
          <div className="brand-text-block">
            <span className="brand-title">ATI System</span>
            <span className="brand-subtitle">SLIATE Portal</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/" end className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} title="Dashboard Overview">
            <LayoutDashboard size={20} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/letters" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} title="Generate Letters as PDF">
            <FileText size={20} />
            {!collapsed && <span>Generate Letters</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/students" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} title="Manage Students">
            <Users size={20} />
            {!collapsed && <span>Manage Students</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/archive" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`} title="Letters Archive">
            <Archive size={20} />
            {!collapsed && <span>Letters Archive</span>}
          </NavLink>
        </li>
      </ul>

      {/* Footer Widget */}
      {!collapsed ? (
        <div className="sidebar-footer-card">
          <div className="sidebar-footer-top">
            <span className="sidebar-footer-title">
              <GraduationCap size={16} color="#93c5fd" />
              SLIATE Official
            </span>
            <span className="liquid-badge primary" style={{ fontSize: '0.66rem', padding: '2px 6px' }}>v2.4</span>
          </div>
          <p className="sidebar-footer-sub">Ministry of Education Sri Lanka</p>
          <div className="sidebar-toggle-wrap">
            <ThemeToggle showLabel={true} />
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}>
          <ThemeToggle compact={true} />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
