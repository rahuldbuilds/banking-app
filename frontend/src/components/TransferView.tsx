import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { AccountDto, BeneficiaryDto } from '../types';

interface TransferViewProps {
  accounts: AccountDto[];
  beneficiaries: BeneficiaryDto[];
  onTransfer: (fromAcc: string, toAcc: string, amount: number) => Promise<string>;
}

export const TransferView: React.FC<TransferViewProps> = ({
  accounts,
  beneficiaries,
  onTransfer
}) => {
  const [fromAccount, setFromAccount] = useState(accounts[0]?.accountNumber || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const selectedSourceAcc = accounts.find(a => a.accountNumber === fromAccount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || !amount) {
      return alert('Please fill in all transfer fields');
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return alert('Please enter a valid positive transfer amount');
    }

    if (selectedSourceAcc && selectedSourceAcc.balance < numAmount) {
      return alert(`Insufficient balance! Available balance is $${selectedSourceAcc.balance.toLocaleString()}`);
    }

    setIsLoading(true);
    setSuccessMsg('');
    try {
      const msg = await onTransfer(fromAccount, toAccount, numAmount);
      setSuccessMsg(msg);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setAmount('');
      setNote('');
    } catch (err: any) {
      alert(`Transfer Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', margin: '0 0 0.35rem 0' }}>Instant Fund Transfer</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Transfer funds securely between internal accounts or registered beneficiaries
        </p>
      </div>

      {successMsg && (
        <div className="glass-panel" style={{
          padding: '1.25rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={24} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Transaction Executed!</div>
            <div style={{ fontSize: '0.85rem' }}>{successMsg}</div>
          </div>
        </div>
      )}

      {/* Main Transfer Form Card */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {/* Source Account Selection */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              TRANSFER FROM (SOURCE ACCOUNT)
            </label>
            <select
              className="form-input"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
            >
              {accounts.map(acc => (
                <option key={acc.accountNumber} value={acc.accountNumber} style={{ background: 'var(--bg-card-solid)' }}>
                  {acc.accountHolderName} ({acc.accountNumber}) - ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
            {selectedSourceAcc && (
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem', display: 'inline-block' }}>
                Available Balance: ${selectedSourceAcc.balance.toLocaleString()}
              </span>
            )}
          </div>

          {/* Target Account Input & Beneficiary Quick Pick */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              DESTINATION ACCOUNT NUMBER
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ACC100098232"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              required
            />

            {/* Quick Pick Beneficiaries */}
            {beneficiaries.length > 0 && (
              <div style={{ marginTop: '0.65rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  QUICK SELECT BENEFICIARY:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {beneficiaries.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        const targetAcc = accounts.find(a => a.id === b.targetAccountId);
                        if (targetAcc) setToAccount(targetAcc.accountNumber);
                      }}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid var(--border-highlight)',
                        color: 'var(--primary)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      + {b.aliasName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              TRANSFER AMOUNT ($)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="any"
              required
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
            />
          </div>

          {/* Transfer Note */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              REMARKS / REFERENCE NOTE (OPTIONAL)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Monthly Rent, Invoice #409"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              padding: '0.85rem',
              justifyContent: 'center',
              fontSize: '1rem',
              marginTop: '0.5rem'
            }}
          >
            <Send size={18} /> {isLoading ? 'Processing Transfer...' : 'Execute Instant Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
};
