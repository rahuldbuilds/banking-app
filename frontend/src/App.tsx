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
import { UserManagementView } from './components/UserManagementView';
import { LoginView } from './components/LoginView';

import { apiService, getMockMode, setMockMode } from './services/api';
import type {
  AccountDto,
  CustomerDto,
  TransactionDto,
  BeneficiaryDto,
  LoanDto,
  LoginResponse,
  UserResponseDto,
  UserRole,
  ViewTab
} from './types';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [isMock, setIsMock] = useState<boolean>(getMockMode());

  // User Auth State - null means unauthenticated
  const [user, setUser] = useState<LoginResponse | null>(null);

  // Data States
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryDto[]>([]);
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [usersList, setUsersList] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<{
    isOpen: boolean;
    type: 'DEPOSIT' | 'WITHDRAW';
    accNum?: string;
  }>({ isOpen: false, type: 'DEPOSIT' });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial Load when User is Logged In
  const loadData = async () => {
    if (!user && !isMock) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Accounts first
      const accList = await apiService.getAllAccounts().catch(() => []);
      setAccounts(accList);

      // 2. Fetch Customers if allowed
      const cust = await apiService.getCustomers().catch(() => []);
      setCustomers(cust);

      // 3. Fetch Users list if ADMIN
      if (user?.role === 'ADMIN' || isMock) {
        const uList = await apiService.getAdminUsers().catch(() => []);
        setUsersList(uList);
      }

      // 4. Fetch account-specific data using first account if available
      const firstAccNum = accList[0]?.accountNumber;
      const firstAccId = accList[0]?.id;

      if (firstAccNum && firstAccId) {
        const [txs, ben, ln] = await Promise.all([
          apiService.getTransactions(firstAccNum).catch(() => []),
          apiService.getBeneficiaries(firstAccId).catch(() => []),
          apiService.getLoansForAccount(firstAccId).catch(() => [])
        ]);

        setTransactions(txs);
        setBeneficiaries(ben);
        setLoans(ln);
      } else {
        setTransactions([]);
        setBeneficiaries([]);
        setLoans([]);
      }
    } catch (e: any) {
      console.error('Backend API error:', e);
      if (e.message?.includes('401') || e.message?.includes('Unauthorized')) {
        setUser(null);
        setErrorMsg('Session expired. Please log in again.');
      } else {
        setErrorMsg(e.message || 'Failed to load banking data from backend server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user || isMock) {
      loadData();
    }
  }, [user, isMock]);

  // Login Handler
  const handleLogin = async (username: string, password?: string): Promise<LoginResponse> => {
    const res = await apiService.login(username, password);
    setUser(res);
    return res;
  };

  // Logout Handler
  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    setAccounts([]);
    setTransactions([]);
    setBeneficiaries([]);
    setLoans([]);
    setUsersList([]);
  };

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

  const handleCreateUser = async (username: string, password?: string, role?: UserRole) => {
    if (!role) return;
    await apiService.createAdminUser({ username, password, role });
    const uList = await apiService.getAdminUsers();
    setUsersList(uList);
  };

  const handleDeleteUser = async (id: number) => {
    await apiService.deleteAdminUser(id);
    const uList = await apiService.getAdminUsers();
    setUsersList(uList);
  };

  // If unauthenticated and not forcing mock mode, show Login Screen
  if (!user && !isMock) {
    return <LoginView onLogin={handleLogin} />;
  }

  const currentUser = user || {
    username: 'DemoUser',
    role: 'ADMIN' as UserRole,
    message: 'Demo Session'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={currentUser}
        isMock={isMock}
        toggleMock={toggleMock}
        onLogout={handleLogout}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={currentUser.role}
          onQuickDeposit={() => setDepositWithdrawModal({ isOpen: true, type: 'DEPOSIT' })}
          onQuickWithdraw={() => setDepositWithdrawModal({ isOpen: true, type: 'WITHDRAW' })}
        />

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 70px)' }}>
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{errorMsg}</span>
              <button
                onClick={() => loadData()}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                Retry Request
              </button>
            </div>
          )}

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

              {activeTab === 'users' && (
                <UserManagementView
                  users={usersList}
                  onCreateUser={handleCreateUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}

              {activeTab === 'accounts' && (
                <AccountsView
                  accounts={accounts}
                  userRole={currentUser.role}
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
                  userRole={currentUser.role}
                  onApplyLoan={handleApplyLoan}
                  onApproveLoan={handleApproveLoan}
                />
              )}

              {activeTab === 'customers' && (
                <CustomerKycView
                  customers={customers}
                  userRole={currentUser.role}
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
