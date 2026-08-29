import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { AccountDto, TransactionDto, ViewTab } from '../types';

interface DashboardOverviewProps {
  accounts: AccountDto[];
  transactions: TransactionDto[];
  setActiveTab: (tab: ViewTab) => void;
  onOpenDepositModal: (accNum: string) => void;
  onOpenWithdrawModal: (accNum: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  accounts,
  transactions,
  setActiveTab,
  onOpenDepositModal,
  onOpenWithdrawModal
}) => {
  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const activeAccountsCount = accounts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge badge-active" style={{ marginBottom: '0.5rem' }}>
            <CheckCircle2 size={12} /> Real-Time Banking Core
          </span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.3rem 0', fontWeight: 700 }}>
            Welcome back, <span className="gradient-text">Rahul</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '600px' }}>
            Manage high-frequency transactions, inspect real-time account ledgers, review loan applications, and execute instant fund transfers seamlessly.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Metric 1 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL NET BALANCE</span>
              <h3 style={{ fontSize: '1.75rem', margin: '0.35rem 0', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#34d399', marginTop: '0.5rem' }}>
            <TrendingUp size={14} /> +4.2% from last month
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE ACCOUNTS</span>
              <h3 style={{ fontSize: '1.75rem', margin: '0.35rem 0', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {activeAccountsCount} Accounts
              </h3>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Savings & Checking verified
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM TRANSACTIONS</span>
              <h3 style={{ fontSize: '1.75rem', margin: '0.35rem 0', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {transactions.length} Logged
              </h3>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Audit trail active
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Quick Accounts Summary */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Primary Accounts</h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('accounts')}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {accounts.map(acc => (
              <div key={acc.accountNumber} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: acc.accountType === 'BUSINESS' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: acc.accountType === 'BUSINESS' ? '#8b5cf6' : '#3b82f6'
                  }}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{acc.accountHolderName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {acc.accountNumber} • <span style={{ textTransform: 'lowercase' }}>{acc.accountType}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
                    ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                    <button
                      onClick={() => onOpenDepositModal(acc.accountNumber)}
                      style={{ background: 'rgba(16, 185, 129, 0.15)', border: 'none', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      + Deposit
                    </button>
                    <button
                      onClick={() => onOpenWithdrawModal(acc.accountNumber)}
                      style={{ background: 'rgba(244, 63, 94, 0.15)', border: 'none', color: '#f87171', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      - Withdraw
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Activity</h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('transactions')}>
              Ledger
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {transactions.slice(0, 5).map((tx, idx) => {
              const isPositive = tx.transactionType === 'DEPOSIT';
              return (
                <div key={tx.id || idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: isPositive ? '#34d399' : '#f87171',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tx.transactionType}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: isPositive ? '#34d399' : 'var(--text-main)'
                  }}>
                    {isPositive ? '+' : '-'}${tx.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
