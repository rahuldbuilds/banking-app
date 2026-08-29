import React, { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react';
import type { TransactionDto } from '../types';

interface TransactionsViewProps {
  transactions: TransactionDto[];
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredTxs = transactions.filter(tx => {
    const matchesSearch =
      tx.accountId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || tx.transactionType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Transaction Audit Ledger</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Comprehensive immutable activity history of system deposits, withdrawals, and fund transfers
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by account ID or transaction type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-input"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAW">Withdrawals</option>
            <option value="TRANSFER">Transfers</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TX ID</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCOUNT ID</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TYPE</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TIMESTAMP</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'right' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No matching transactions recorded in ledger.
                </td>
              </tr>
            ) : (
              filteredTxs.map((tx, idx) => {
                const isDeposit = tx.transactionType === 'DEPOSIT';
                return (
                  <tr key={tx.id || idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      #{tx.id || idx + 1000}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      ID #{tx.accountId}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge ${isDeposit ? 'badge-active' : 'badge-pending'}`}>
                        {isDeposit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {tx.transactionType}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td style={{
                      padding: '1rem 1.25rem',
                      fontSize: '1rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      textAlign: 'right',
                      color: isDeposit ? '#34d399' : 'var(--text-main)'
                    }}>
                      {isDeposit ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
