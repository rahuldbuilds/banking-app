import React, { useState, useRef } from 'react';
import {
  Wallet,
  PlusCircle,
  X,
  Trash2,
  PenTool,
  RefreshCw
} from 'lucide-react';
import type { AccountDto } from '../types';

interface AccountsViewProps {
  accounts: AccountDto[];
  userRole?: string;
  onCreateAccount: (account: AccountDto) => Promise<void>;
  onDeleteAccount: (accountNumber: string) => Promise<void>;
  onOpenDepositModal: (accNum: string) => void;
  onOpenWithdrawModal: (accNum: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  userRole,
  onCreateAccount,
  onDeleteAccount,
  onOpenDepositModal,
  onOpenWithdrawModal
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [initialBalance, setInitialBalance] = useState('1000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const canCreateAccount = !userRole || ['ADMIN', 'ACCOUNT_CREATOR'].includes(userRole);
  const canDepositWithdraw = !userRole || ['ADMIN', 'CASH_DEPOSITOR'].includes(userRole);
  const canCloseAccount = !userRole || userRole === 'ADMIN';

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName) return alert('Please enter Account Holder Name');

    setIsSubmitting(true);
    try {
      let sigData = '';
      if (canvasRef.current && hasSignature) {
        sigData = canvasRef.current.toDataURL('image/png');
      }

      await onCreateAccount({
        accountNumber: `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        accountHolderName: holderName,
        balance: parseFloat(initialBalance) || 0,
        accountType: accountType,
        signatureImage: sigData,
        status: 'ACTIVE'
      });

      setShowCreateModal(false);
      setHolderName('');
      setInitialBalance('1000');
      clearCanvas();
    } catch (err: any) {
      alert(`Error creating account: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Account Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Manage active savings, checking, and enterprise accounts
          </p>
        </div>
        {canCreateAccount && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <PlusCircle size={18} /> Open New Account
          </button>
        )}
      </div>

      {/* Grid of Accounts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {accounts.map(acc => (
          <div key={acc.accountNumber} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Wallet size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{acc.accountHolderName}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {acc.accountNumber}
                  </span>
                </div>
              </div>
              <span className={`badge ${acc.status === 'ACTIVE' ? 'badge-active' : 'badge-rejected'}`}>
                {acc.status}
              </span>
            </div>

            <div style={{ margin: '1rem 0', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>AVAILABLE BALANCE</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {acc.signatureImage && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  VERIFIED DIGITAL SIGNATURE
                </span>
                <img
                  src={acc.signatureImage}
                  alt="Signature"
                  style={{ maxHeight: '35px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              {canDepositWithdraw ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => onOpenDepositModal(acc.accountNumber)}
                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => onOpenWithdrawModal(acc.accountNumber)}
                    style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Withdraw
                  </button>
                </div>
              ) : <div />}

              {canCloseAccount && (
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to close account ${acc.accountNumber}?`)) {
                      onDeleteAccount(acc.accountNumber);
                    }
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.35rem' }}
                  title="Close Account"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Create Account */}
      {showCreateModal && (
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
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', background: 'var(--bg-card-solid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Open New Bank Account</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  ACCOUNT HOLDER NAME
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Yadav"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    ACCOUNT TYPE
                  </label>
                  <select
                    className="form-input"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CHECKING">Checking Account</option>
                    <option value="BUSINESS">Business Corporate</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    INITIAL DEPOSIT ($)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              {/* Digital Canvas Signature */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <PenTool size={14} /> DIGITAL SIGNATURE CAPTURE
                  </label>
                  {hasSignature && (
                    <button type="button" onClick={clearCanvas} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <RefreshCw size={12} /> Clear
                    </button>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={100}
                  className="sig-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ width: '100%', height: '100px' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.25rem' }}>
                  Draw account holder signature using mouse or stylus touch
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Confirm Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
