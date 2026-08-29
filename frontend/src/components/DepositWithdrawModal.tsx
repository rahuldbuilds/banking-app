import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { AccountDto } from '../types';

interface DepositWithdrawModalProps {
  type: 'DEPOSIT' | 'WITHDRAW';
  initialAccNum?: string;
  accounts: AccountDto[];
  onClose: () => void;
  onDeposit: (accNum: string, amount: number) => Promise<void>;
  onWithdraw: (accNum: string, amount: number) => Promise<void>;
}

export const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  type,
  initialAccNum,
  accounts,
  onClose,
  onDeposit,
  onWithdraw
}) => {
  const [selectedAccNum, setSelectedAccNum] = useState(initialAccNum || accounts[0]?.accountNumber || '');
  const [amount, setAmount] = useState('500');
  const [isLoading, setIsLoading] = useState(false);

  const isDeposit = type === 'DEPOSIT';
  const selectedAcc = accounts.find(a => a.accountNumber === selectedAccNum);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccNum || !amount) return;

    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) return alert('Invalid amount');

    setIsLoading(true);
    try {
      if (isDeposit) {
        await onDeposit(selectedAccNum, numAmt);
      } else {
        await onWithdraw(selectedAccNum, numAmt);
      }
      onClose();
    } catch (err: any) {
      alert(`Operation Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isDeposit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: isDeposit ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              {isDeposit ? 'Deposit Funds' : 'Withdraw Cash'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              SELECT TARGET ACCOUNT
            </label>
            <select
              className="form-input"
              value={selectedAccNum}
              onChange={(e) => setSelectedAccNum(e.target.value)}
            >
              {accounts.map(acc => (
                <option key={acc.accountNumber} value={acc.accountNumber} style={{ background: 'var(--bg-card-solid)' }}>
                  {acc.accountHolderName} ({acc.accountNumber}) - ${acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
            {selectedAcc && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Current Balance: ${(selectedAcc.balance || 0).toLocaleString()}
              </span>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              AMOUNT ($)
            </label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="any"
              required
              style={{ fontSize: '1.2rem', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                flex: 1,
                background: isDeposit ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                boxShadow: isDeposit ? '0 4px 14px var(--secondary-glow)' : '0 4px 14px rgba(244, 63, 94, 0.3)'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isDeposit ? 'Confirm Deposit' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
