import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ASSETS } from '../assets/images';
import ThemeToggle from '../components/ThemeToggle';

export const Login = () => {
  const [email, setEmail] = useState('registrar@ati.edu.lk');
  const [password, setPassword] = useState('sliate2026');
  const [role, setRole] = useState('Academic Registrar');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password, role);
      setLoading(false);
      navigate('/');
    }, 600);
  };

  const handleQuickDemo = (demoRole, demoEmail) => {
    setEmail(demoEmail);
    setRole(demoRole);
    login(demoEmail, 'demo123', demoRole);
    navigate('/');
  };

  return (
    <div 
      className="login-view-wrapper"
      style={{
        backgroundImage: `url("${ASSETS.BG_IMAGE}")`,
      }}
    >
      {/* Liquid Backdrop Blur and Tint */}
      <div className="login-backdrop-tint" />

      {/* Floating Theme Toggle on Login View */}
      <div style={{ position: 'absolute', top: '24px', right: '28px', zIndex: 10 }}>
        <ThemeToggle showLabel={true} />
      </div>

      {/* Ambient Moving Glows */}
      <div className="ambient-blobs-container">
        <div className="ambient-blob ambient-blob-1" style={{ opacity: 0.3 }} />
        <div className="ambient-blob ambient-blob-2" style={{ opacity: 0.25 }} />
      </div>

      {/* Frosted Liquid Glass Login Card */}
      <div className="login-glass-card">
        {/* Header Block */}
        <div className="login-header-group">
          <img 
            src={ASSETS.LOGO_IMAGE} 
            alt="ATI Logo" 
            className="login-institution-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/1e293b/93c5fd?text=ATI';
            }}
          />
          <h1 className="login-title">ATI Portal</h1>
          <p className="login-desc">
            Advanced Technological Institute Official Letter Generation & Student Information System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email Field */}
          <div className="glass-input-group">
            <label className="glass-label">Official Email</label>
            <div className="glass-input-wrapper">
              <input
                type="email"
                required
                className="glass-input with-icon"
                placeholder="officer@ati.edu.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={16} className="glass-input-icon" />
            </div>
          </div>

          {/* Password Field */}
          <div className="glass-input-group">
            <label className="glass-label">Password</label>
            <div className="glass-input-wrapper">
              <input
                type="password"
                required
                className="glass-input with-icon"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} className="glass-input-icon" />
            </div>
          </div>

          {/* Role Selection */}
          <div className="glass-input-group">
            <label className="glass-label">Department / Role</label>
            <select
              className="glass-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Academic Registrar">Academic Registrar / Director</option>
              <option value="Student Affairs Officer">Student Affairs Division</option>
              <option value="HNDIT Department Head">HNDIT Department Head</option>
              <option value="Examination Division">Examination & Verification Officer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-glass btn-glass-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'center' }}>
            Instant Access Demo Credentials:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-glass btn-glass-ghost"
              style={{ flex: '1 1 120px', padding: '8px 10px', fontSize: '0.78rem' }}
              onClick={() => handleQuickDemo('Academic Registrar', 'registrar@ati.edu.lk')}
            >
              <ShieldCheck size={14} color="#10b981" />
              <span>Registrar</span>
            </button>
            <button
              type="button"
              className="btn-glass btn-glass-ghost"
              style={{ flex: '1 1 120px', padding: '8px 10px', fontSize: '0.78rem' }}
              onClick={() => handleQuickDemo('Student Affairs', 'affairs@ati.edu.lk')}
            >
              <GraduationCap size={14} color="var(--primary)" />
              <span>Student Affairs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
