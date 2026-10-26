import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div 
      className="liquid-glass-elevated toast-notification"
      style={{
        borderLeft: `4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--primary)'}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        {type === 'success' && <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />}
        {type === 'error' && <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />}
        {type === 'info' && <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />}

        <div style={{ flex: 1, fontSize: '0.88rem', color: 'var(--color-text)', wordBreak: 'break-word' }}>
          {message}
        </div>
      </div>

      <button 
        onClick={onClose}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--color-text-muted)', 
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
