import React, { useState } from 'react';
import { Building2, PlusCircle, CheckCircle2 } from 'lucide-react';
import type { LoanDto, AccountDto } from '../types';

interface LoansViewProps {
  loans: LoanDto[];
  accounts: AccountDto[];
  userRole: string;
  onApplyLoan: (loan: LoanDto) => Promise<void>;
  onApproveLoan: (loanId: number) => Promise<void>;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  accounts,
  userRole,
  onApplyLoan,
  onApproveLoan
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedAccId, setSelectedAccId] = useState<number>(accounts[0]?.id || 101);
  const [amount, setAmount] = useState('250000');
  const [loanType, setLoanType] = useState('HOME');
  const [interestRate, setInterestRate] = useState('8.5');
  const [isLoading, setIsLoading] = useState(false);

  const isOfficerOrAdmin = userRole === 'ADMIN' || userRole === 'LOAN_OFFICER';

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setIsLoading(true);
    try {
      await onApplyLoan({
        accountId: selectedAccId,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        loanType: loanType,
        status: 'PENDING'
      });
      setShowApplyModal(false);
    } catch (err: any) {
      alert(`Error applying for loan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Loan & Credit Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Apply for credit facilities and review loan approval statuses
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowApplyModal(true)}>
          <PlusCircle size={18} /> Apply For Loan
        </button>
      </div>

      {/* Grid of Active / Pending Loans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {loans.map(loan => {
          const acc = accounts.find(a => a.id === loan.accountId);
          const isApproved = loan.status === 'APPROVED';
          const isPending = loan.status === 'PENDING';

          return (
            <div key={loan.id} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{loan.loanType} LOAN</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Account: {acc ? acc.accountHolderName : `ID #${loan.accountId}`}
                    </span>
                  </div>
                </div>
                <span className={`badge ${isApproved ? 'badge-active' : isPending ? 'badge-pending' : 'badge-rejected'}`}>
                  {loan.status}
                </span>
              </div>

              <div style={{ margin: '0.85rem 0', padding: '0.85rem', background: 'var(--bg-input)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>PRINCIPAL AMOUNT</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  ${loan.amount.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {loan.interestRate}% APR Fixed Interest Rate
                </span>
              </div>

              {/* Loan Officer / Admin Approval Action */}
              {isPending && isOfficerOrAdmin && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => loan.id && onApproveLoan(loan.id)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 14px var(--secondary-glow)'
                    }}
                  >
                    <CheckCircle2 size={16} /> Approve Loan Request
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal - Apply Loan */}
      {showApplyModal && (
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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.1rem' }}>Loan Application Form</h3>

            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  APPLICANT ACCOUNT
                </label>
                <select
                  className="form-input"
                  value={selectedAccId}
                  onChange={(e) => setSelectedAccId(parseInt(e.target.value))}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id} style={{ background: 'var(--bg-card-solid)' }}>
                      {acc.accountHolderName} ({acc.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  LOAN CATEGORY
                </label>
                <select
                  className="form-input"
                  value={loanType}
                  onChange={(e) => {
                    setLoanType(e.target.value);
                    if (e.target.value === 'HOME') setInterestRate('8.5');
                    else if (e.target.value === 'PERSONAL') setInterestRate('11.5');
                    else if (e.target.value === 'AUTO') setInterestRate('9.2');
                  }}
                >
                  <option value="HOME">Home Mortgage Loan (8.5%)</option>
                  <option value="PERSONAL">Personal Cash Credit (11.5%)</option>
                  <option value="AUTO">Auto Vehicle Loan (9.2%)</option>
                  <option value="EDUCATION">Student Education Loan (7.0%)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  REQUESTED AMOUNT ($)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="5000"
                  step="5000"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
