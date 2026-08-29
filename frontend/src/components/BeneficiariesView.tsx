import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Send } from 'lucide-react';
import type { BeneficiaryDto, AccountDto, ViewTab } from '../types';

interface BeneficiariesViewProps {
  beneficiaries: BeneficiaryDto[];
  accounts: AccountDto[];
  onAddBeneficiary: (b: BeneficiaryDto) => Promise<void>;
  onDeleteBeneficiary: (id: number) => Promise<void>;
  setActiveTab: (tab: ViewTab) => void;
}

export const BeneficiariesView: React.FC<BeneficiariesViewProps> = ({
  beneficiaries,
  accounts,
  onAddBeneficiary,
  onDeleteBeneficiary,
  setActiveTab
}) => {
  const [selectedAccountId] = useState<number>(accounts[0]?.id || 101);
  const [targetAccountNum, setTargetAccountNum] = useState('');
  const [aliasName, setAliasName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccountNum || !aliasName) return alert('Please enter target account & alias name');

    const targetAcc = accounts.find(a => a.accountNumber === targetAccountNum || a.id?.toString() === targetAccountNum);
    const targetId = targetAcc ? targetAcc.id || 102 : parseInt(targetAccountNum) || 102;

    setIsLoading(true);
    try {
      await onAddBeneficiary({
        accountId: selectedAccountId,
        targetAccountId: targetId,
        aliasName: aliasName
      });
      setTargetAccountNum('');
      setAliasName('');
    } catch (err: any) {
      alert(`Error adding beneficiary: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Saved Beneficiaries</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Manage pre-approved destination accounts for 1-click fund transfers
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column - List of Beneficiaries */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Beneficiaries</h3>

          {beneficiaries.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No saved beneficiaries found. Add one using the form on the right!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {beneficiaries.map(b => {
                const targetAcc = accounts.find(a => a.id === b.targetAccountId);
                return (
                  <div key={b.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.aliasName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Target Account: {targetAcc ? targetAcc.accountNumber : `ID #${b.targetAccountId}`}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        onClick={() => setActiveTab('transfer')}
                      >
                        <Send size={14} /> Transfer
                      </button>
                      {b.id && (
                        <button
                          onClick={() => onDeleteBeneficiary(b.id!)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.35rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Add Beneficiary Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
            <UserPlus size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Add Beneficiary</h3>
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                ALIAS NAME
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Landlord Rent"
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                TARGET ACCOUNT (NUMBER OR ID)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ACC100098232"
                value={targetAccountNum}
                onChange={(e) => setTargetAccountNum(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              {isLoading ? 'Saving...' : 'Save Beneficiary'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
