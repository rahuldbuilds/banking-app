import React, { useState } from 'react';
import { Shield, UserPlus, X, CheckCircle, Clock, Trash2 } from 'lucide-react';
import type { UserResponseDto, UserRole } from '../types';

interface UserManagementViewProps {
  users: UserResponseDto[];
  onCreateUser: (username: string, password?: string, role?: UserRole) => Promise<void>;
  onDeleteUser?: (id: number) => Promise<void>;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onCreateUser,
  onDeleteUser
}) => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('LOAN_OFFICER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert('Username and Password are required');

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onCreateUser(username, password, role);
      setShowModal(false);
      setUsername('');
      setPassword('');
      setRole('LOAN_OFFICER');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeStyle = (r: UserRole) => {
    switch (r) {
      case 'ADMIN':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', color: '#f87171' };
      case 'LOAN_OFFICER':
        return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' };
      case 'CASH_DEPOSITOR':
        return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', color: '#34d399' };
      case 'TRANSACTION_HANDLER':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' };
      case 'ACCOUNT_CREATOR':
        return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' };
      case 'CUSTOMER':
        return { bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.3)', color: '#9ca3af' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>System User Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Manage staff credentials and role-based authorization rules
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Register Staff / User
        </button>
      </div>

      {/* Grid of Registered Users */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {users.map(u => {
          const badge = getRoleBadgeStyle(u.role);
          return (
            <div key={u.id} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: badge.bg,
                    color: badge.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}>
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{u.username}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ID #{u.id}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    color: badge.color,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}>
                    {u.role}
                  </span>

                  {u.role !== 'ADMIN' && onDeleteUser && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete user account '${u.username}'?`)) {
                          onDeleteUser(u.id);
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Delete User Account"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <CheckCircle size={14} style={{ color: u.enabled ? '#34d399' : '#f87171' }} />
                  <span>Account Status: <strong>{u.enabled ? 'ACTIVE' : 'DISABLED'}</strong></span>
                </div>
                {u.createdAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <Clock size={14} />
                    <span>Created: {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Create Staff / User */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '1.75rem', background: 'var(--bg-card-solid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Register New User Account</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  USERNAME
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. loan_officer_01"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Set account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  FUNCTIONAL ROLE
                </label>
                <select
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="LOAN_OFFICER">LOAN_OFFICER (Credit & Approvals)</option>
                  <option value="CASH_DEPOSITOR">CASH_DEPOSITOR (Deposits & Withdrawals)</option>
                  <option value="TRANSACTION_HANDLER">TRANSACTION_HANDLER (Transfers & Audits)</option>
                  <option value="ACCOUNT_CREATOR">ACCOUNT_CREATOR (KYC & Account Opening)</option>
                  <option value="CUSTOMER">CUSTOMER (Standard User)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
