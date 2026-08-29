import React from 'react';
import {
  Landmark,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react';
import type { LoginResponse } from '../types';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: LoginResponse;
  isMock: boolean;
  toggleMock: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  user,
  isMock,
  toggleMock,
  onLogout
}) => {
  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'var(--backdrop-blur)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 14px var(--primary-glow)'
        }}>
          <Landmark size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>
            Aura<span className="gradient-text">Bank</span>
          </h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Enterprise Banking Portal
          </span>
        </div>
      </div>

      {/* Center - API Status Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={toggleMock}
          style={{
            background: isMock ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${isMock ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: isMock ? '#fbbf24' : '#34d399',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
          title="Click to toggle between Spring Boot API and Demo Mode"
        >
          {isMock ? (
            <>
              <AlertCircle size={14} /> Demo Mode (Offline Data)
            </>
          ) : (
            <>
              <CheckCircle2 size={14} /> Spring Boot Connected
            </>
          )}
        </button>
      </div>

      {/* Right - Role & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Authenticated Role Badge (Read-Only from Backend) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role:</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.role}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>

        {/* User Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '10px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.1 }}>{user.username}</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>{user.role}</span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f87171',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Sign Out Session"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
