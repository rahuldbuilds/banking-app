import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Send,
  Users,
  Building2,
  FileCheck2,
  History,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import type { ViewTab } from '../types';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  userRole: string;
  onQuickDeposit: () => void;
  onQuickWithdraw: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  onQuickDeposit,
  onQuickWithdraw
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'LOAN_OFFICER', 'CUSTOMER'] },
    { id: 'accounts', label: 'Accounts', icon: Wallet, roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },
    { id: 'transfer', label: 'Fund Transfer', icon: Send, roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users, roles: ['ADMIN', 'STAFF', 'CUSTOMER'] },
    { id: 'loans', label: 'Loan Portal', icon: Building2, roles: ['ADMIN', 'STAFF', 'LOAN_OFFICER', 'CUSTOMER'] },
    { id: 'customers', label: 'KYC & Customers', icon: FileCheck2, roles: ['ADMIN', 'STAFF'] },
    { id: 'transactions', label: 'Transaction Audit', icon: History, roles: ['ADMIN', 'STAFF', 'CUSTOMER'] }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'var(--backdrop-blur)',
      padding: '1.25rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 70px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0 0.75rem 0.5rem 0.75rem'
        }}>
          Navigation
        </span>

        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ViewTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.25) 100%)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Quick Action Widget Card */}
      <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.65rem' }}>
          Quick Cash Actions
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onQuickDeposit}
            style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '0.5rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <ArrowDownLeft size={14} /> Deposit
          </button>
          <button
            onClick={onQuickWithdraw}
            style={{
              flex: 1,
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f87171',
              padding: '0.5rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <ArrowUpRight size={14} /> Withdraw
          </button>
        </div>
      </div>
    </aside>
  );
};
