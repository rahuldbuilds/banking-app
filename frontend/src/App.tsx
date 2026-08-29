import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { AccountsView } from './components/AccountsView';
import { TransferView } from './components/TransferView';
import { DepositWithdrawModal } from './components/DepositWithdrawModal';
import { BeneficiariesView } from './components/BeneficiariesView';
import { LoansView } from './components/LoansView';
import { CustomerKycView } from './components/CustomerKycView';
import { TransactionsView } from './components/TransactionsView';

import { apiService, getMockMode, setMockMode } from './services/api';
import type {
  AccountDto,
  CustomerDto,
  TransactionDto,
  BeneficiaryDto,
  LoanDto,
  LoginResponse,
  ViewTab
} from './types';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [isMock, setIsMock] = useState<boolean>(getMockMode());

  // User Auth State
  const [user, setUser] = useState<LoginResponse>({
    username: 'Rahul Yadav',
    role: 'ADMIN',
    message: 'Active Session'
  });

  // Data States
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryDto[]>([]);
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<{
    isOpen: boolean;
    type: 'DEPOSIT' | 'WITHDRAW';
    accNum?: string;
  }>({ isOpen: false, type: 'DEPOSIT' });

  // Initial Load
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accList, cust, txs, ben, ln] = await Promise.all([
        apiService.getAllAccounts(),
        apiService.getCustomers(),
        apiService.getTransactions('ACC100098231'),
        apiService.getBeneficiaries(101),
        apiService.getLoansForAccount(101)
      ]);
      setAccounts(accList);
      setCustomers(cust);
      setTransactions(txs);
      setBeneficiaries(ben);
      setLoans(ln);
    } catch (e) {
      console.warn('Backend API connection failed, switching to demo mock mode', e);
      setMockMode(true);
      setIsMock(true);
      const accList = await apiService.getAllAccounts();
      const cust = await apiService.getCustomers();
      const txs = await apiService.getTransactions('ACC100098231');
      const ben = await apiService.getBeneficiaries(101);
      const ln = await apiService.getLoansForAccount(101);
      setAccounts(accList);
      setCustomers(cust);
      setTransactions(txs);
      setBeneficiaries(ben);
      setLoans(ln);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isMock]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleMock = () => {
    const nextMock = !isMock;
    setMockMode(nextMock);
    setIsMock(nextMock);
  };

  const setUserRole = (role: 'ADMIN' | 'STAFF' | 'LOAN_OFFICER' | 'CUSTOMER') => {
    setUser(prev => ({ ...prev, role }));
  };

  // Action Handlers
  const handleCreateAccount = async (account: AccountDto) => {
    const created = await apiService.createAccount(account);
    setAccounts(prev => [created, ...prev]);
  };

  const handleDeleteAccount = async (accNum: string) => {
    await apiService.deleteAccount(accNum);
    setAccounts(prev => prev.filter(a => a.accountNumber !== accNum));
  };

  const handleDeposit = async (accNum: string, amount: number) => {
    const updated = await apiService.deposit(accNum, amount);
    setAccounts(prev => prev.map(a => a.accountNumber === accNum ? updated : a));
    const txs = await apiService.getTransactions(accNum);
    setTransactions(txs);
  };

  const handleWithdraw = async (accNum: string, amount: number) => {
    const updated = await apiService.withdraw(accNum, amount);
    setAccounts(prev => prev.map(a => a.accountNumber === accNum ? updated : a));
    const txs = await apiService.getTransactions(accNum);
    setTransactions(txs);
  };

  const handleTransfer = async (fromAcc: string, toAcc: string, amount: number) => {
    const msg = await apiService.transfer({ fromAccountNumber: fromAcc, toAccountNumber: toAcc, amount });
    const accs = await apiService.getAllAccounts();
    setAccounts(accs);
    const txs = await apiService.getTransactions(fromAcc);
    setTransactions(txs);
    return msg;
  };

  const handleAddBeneficiary = async (b: BeneficiaryDto) => {
    const newB = await apiService.addBeneficiary(b);
    setBeneficiaries(prev => [...prev, newB]);
  };

  const handleDeleteBeneficiary = async (id: number) => {
    await apiService.deleteBeneficiary(id);
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
  };

  const handleApplyLoan = async (loan: LoanDto) => {
    const created = await apiService.applyLoan(loan);
    setLoans(prev => [created, ...prev]);
  };

  const handleApproveLoan = async (loanId: number) => {
    const approved = await apiService.approveLoan(loanId);
    setLoans(prev => prev.map(l => l.id === loanId ? approved : l));
  };

  const handleCreateCustomer = async (cust: CustomerDto) => {
    const created = await apiService.createCustomer(cust);
    setCustomers(prev => [created, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        setUserRole={setUserRole}
        isMock={isMock}
        toggleMock={toggleMock}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={user.role}
          onQuickDeposit={() => setDepositWithdrawModal({ isOpen: true, type: 'DEPOSIT' })}
          onQuickWithdraw={() => setDepositWithdrawModal({ isOpen: true, type: 'WITHDRAW' })}
        />

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 70px)' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'var(--primary)', fontWeight: 600 }}>
              Loading Banking Systems...
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <DashboardOverview
                  accounts={accounts}
                  transactions={transactions}
                  setActiveTab={setActiveTab}
                  onOpenDepositModal={(accNum) => setDepositWithdrawModal({ isOpen: true, type: 'DEPOSIT', accNum })}
                  onOpenWithdrawModal={(accNum) => setDepositWithdrawModal({ isOpen: true, type: 'WITHDRAW', accNum })}
                />
              )}

              {activeTab === 'accounts' && (
                <AccountsView
                  accounts={accounts}
                  onCreateAccount={handleCreateAccount}
                  onDeleteAccount={handleDeleteAccount}
                  onOpenDepositModal={(accNum) => setDepositWithdrawModal({ isOpen: true, type: 'DEPOSIT', accNum })}
                  onOpenWithdrawModal={(accNum) => setDepositWithdrawModal({ isOpen: true, type: 'WITHDRAW', accNum })}
                />
              )}

              {activeTab === 'transfer' && (
                <TransferView
                  accounts={accounts}
                  beneficiaries={beneficiaries}
                  onTransfer={handleTransfer}
                />
              )}

              {activeTab === 'beneficiaries' && (
                <BeneficiariesView
                  beneficiaries={beneficiaries}
                  accounts={accounts}
                  onAddBeneficiary={handleAddBeneficiary}
                  onDeleteBeneficiary={handleDeleteBeneficiary}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'loans' && (
                <LoansView
                  loans={loans}
                  accounts={accounts}
                  userRole={user.role}
                  onApplyLoan={handleApplyLoan}
                  onApproveLoan={handleApproveLoan}
                />
              )}

              {activeTab === 'customers' && (
                <CustomerKycView
                  customers={customers}
                  onCreateCustomer={handleCreateCustomer}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsView
                  transactions={transactions}
                />
              )}
            </>
          )}
        </main>
      </div>

      {depositWithdrawModal.isOpen && (
        <DepositWithdrawModal
          type={depositWithdrawModal.type}
          initialAccNum={depositWithdrawModal.accNum}
          accounts={accounts}
          onClose={() => setDepositWithdrawModal({ isOpen: false, type: 'DEPOSIT' })}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
        />
      )}
    </div>
  );
}

export default App;
