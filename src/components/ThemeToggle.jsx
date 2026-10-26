import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ compact = false, showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className="btn-glass theme-toggle-btn"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Dark and Light Mode"
      style={{
        padding: compact ? '8px' : '8px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        borderRadius: '9999px',
        transition: 'all 0.25s ease'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '20px',
          height: '20px'
        }}
      >
        {isDark ? (
          <Moon size={18} style={{ color: '#93c5fd', filter: 'drop-shadow(0 0 6px rgba(147, 197, 253, 0.6))' }} />
        ) : (
          <Sun size={18} style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' }} />
        )}
      </div>

      {showLabel && (
        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
