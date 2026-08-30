import type {
  AccountDto,
  CustomerDto,
  TransactionDto,
  TransferFundDto,
  BeneficiaryDto,
  LoanDto,
  LoginResponse,
  CreateUserDto,
  UserResponseDto
} from '../types';

const API_BASE_URL = '/api';

let mockAccounts: AccountDto[] = [
  {
    id: 101,
    accountNumber: 'ACC100098231',
    accountHolderName: 'Rahul Yadav',
    balance: 145850.50,
    accountType: 'SAVINGS',
    signatureImage: '',
    status: 'ACTIVE'
  },
  {
    id: 102,
    accountNumber: 'ACC100098232',
    accountHolderName: 'Priya Sharma',
    balance: 89400.00,
    accountType: 'CHECKING',
    signatureImage: '',
    status: 'ACTIVE'
  },
  {
    id: 103,
    accountNumber: 'ACC100098233',
    accountHolderName: 'Apex Innovations Corp',
    balance: 520000.75,
    accountType: 'BUSINESS',
    signatureImage: '',
    status: 'ACTIVE'
  }
];

let mockCustomers: CustomerDto[] = [
  {
    id: 1,
    firstName: 'Rahul',
    lastName: 'Yadav',
    email: 'rahul.yadav@example.com',
    phoneNumber: '+91 9876543210',
    aadharCardNo: '5489-1234-9012'
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    phoneNumber: '+91 9812345678',
    aadharCardNo: '9812-4321-8765'
  }
];

let mockTransactions: TransactionDto[] = [
  {
    id: 1,
    accountId: 101,
    amount: 15000,
    transactionType: 'DEPOSIT',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    accountId: 101,
    amount: 2500,
    transactionType: 'WITHDRAW',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 3,
    accountId: 101,
    amount: 5000,
    transactionType: 'TRANSFER',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

let mockBeneficiaries: BeneficiaryDto[] = [
  {
    id: 1,
    accountId: 101,
    targetAccountId: 102,
    aliasName: 'Priya (Rent & Utilities)'
  }
];

let mockLoans: LoanDto[] = [
  {
    id: 1,
    accountId: 101,
    amount: 500000,
    interestRate: 8.5,
    loanType: 'HOME',
    status: 'APPROVED'
  },
  {
    id: 2,
    accountId: 102,
    amount: 150000,
    interestRate: 10.5,
    loanType: 'PERSONAL',
    status: 'PENDING'
  }
];

let isMockMode = false;

export const setMockMode = (enabled: boolean) => {
  isMockMode = enabled;
};

export const getMockMode = () => isMockMode;

async function fetchJson(url: string, options?: RequestInit) {
  if (isMockMode) throw new Error('Mock mode forced');

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP Error ${res.status}`);
  }
  return res.json();
}

export const apiService = {
  login: async (username: string, password?: string): Promise<LoginResponse> => {
    if (isMockMode) {
      const role = username.toLowerCase().includes('admin')
        ? 'ADMIN'
        : username.toLowerCase().includes('staff')
        ? 'STAFF'
        : 'CUSTOMER';
      return {
        username: username || 'DemoUser',
        role: role as any,
        message: 'Logged in (Demo Mode Active)'
      };
    }

    try {
      const result = await fetchJson(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      isMockMode = false;
      return result;
    } catch (e: any) {
      throw e;
    }
  },

  logout: async (): Promise<string> => {
    if (isMockMode) return 'Logged out from Demo mode';
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      return await res.text();
    } catch {
      return 'Logged out';
    }
  },

  getAllAccounts: async (): Promise<AccountDto[]> => {
    if (isMockMode) return [...mockAccounts];
    return await fetchJson(`${API_BASE_URL}/accounts`);
  },

  getAccountByNumber: async (accountNumber: string): Promise<AccountDto> => {
    if (isMockMode) {
      const acc = mockAccounts.find(a => a.accountNumber === accountNumber);
      if (!acc) throw new Error('Account not found');
      return acc;
    }
    return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}`);
  },

  createAccount: async (account: AccountDto): Promise<AccountDto> => {
    if (isMockMode) {
      const newAcc: AccountDto = {
        ...account,
        id: Date.now(),
        accountNumber: account.accountNumber || `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        status: account.status || 'ACTIVE'
      };
      mockAccounts.unshift(newAcc);
      return newAcc;
    }
    return await fetchJson(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      body: JSON.stringify(account)
    });
  },

  deposit: async (accountNumber: string, amount: number): Promise<AccountDto> => {
    if (isMockMode) {
      const acc = mockAccounts.find(a => a.accountNumber === accountNumber);
      if (!acc) throw new Error('Account not found');
      acc.balance += amount;
      mockTransactions.unshift({
        id: Date.now(),
        accountId: acc.id || 101,
        amount,
        transactionType: 'DEPOSIT',
        timestamp: new Date().toISOString()
      });
      return { ...acc };
    }
    return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}/deposit`, {
      method: 'PUT',
      body: JSON.stringify({ amount })
    });
  },

  withdraw: async (accountNumber: string, amount: number): Promise<AccountDto> => {
    if (isMockMode) {
      const acc = mockAccounts.find(a => a.accountNumber === accountNumber);
      if (!acc) throw new Error('Account not found');
      if (acc.balance < amount) throw new Error('Insufficient account funds!');
      acc.balance -= amount;
      mockTransactions.unshift({
        id: Date.now(),
        accountId: acc.id || 101,
        amount,
        transactionType: 'WITHDRAW',
        timestamp: new Date().toISOString()
      });
      return { ...acc };
    }
    return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}/withdraw`, {
      method: 'PUT',
      body: JSON.stringify({ amount })
    });
  },

  transfer: async (transferDto: TransferFundDto): Promise<string> => {
    if (isMockMode) {
      const fromAcc = mockAccounts.find(a => a.accountNumber === transferDto.fromAccountNumber);
      const toAcc = mockAccounts.find(a => a.accountNumber === transferDto.toAccountNumber);
      if (!fromAcc) throw new Error('Source account invalid');
      if (fromAcc.balance < transferDto.amount) throw new Error('Insufficient balance');

      fromAcc.balance -= transferDto.amount;
      if (toAcc) toAcc.balance += transferDto.amount;

      mockTransactions.unshift({
        id: Date.now(),
        accountId: fromAcc.id || 101,
        amount: transferDto.amount,
        transactionType: 'TRANSFER',
        timestamp: new Date().toISOString()
      });
      return 'Transfer successful (Demo Mode)';
    }

    const res = await fetch(`${API_BASE_URL}/accounts/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(transferDto)
    });
    if (!res.ok) throw new Error(await res.text());
    return 'Transfer successful';
  },

  getTransactions: async (accountNumber: string): Promise<TransactionDto[]> => {
    if (isMockMode) return [...mockTransactions];
    return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}/transactions`);
  },

  deleteAccount: async (accountNumber: string): Promise<string> => {
    if (isMockMode) {
      mockAccounts = mockAccounts.filter(a => a.accountNumber !== accountNumber);
      return 'Account closed successfully';
    }
    const res = await fetch(`${API_BASE_URL}/accounts/${accountNumber}`, { method: 'DELETE', credentials: 'include' });
    return await res.text();
  },

  getCustomers: async (): Promise<CustomerDto[]> => {
    if (isMockMode) return [...mockCustomers];
    return await fetchJson(`${API_BASE_URL}/customers`);
  },

  createCustomer: async (customer: CustomerDto): Promise<CustomerDto> => {
    if (isMockMode) {
      const newCust: CustomerDto = { ...customer, id: Date.now() };
      mockCustomers.unshift(newCust);
      return newCust;
    }
    return await fetchJson(`${API_BASE_URL}/customers`, {
      method: 'POST',
      body: JSON.stringify(customer)
    });
  },

  getBeneficiaries: async (accountId: number): Promise<BeneficiaryDto[]> => {
    if (isMockMode) return mockBeneficiaries.filter(b => b.accountId === accountId);
    return await fetchJson(`${API_BASE_URL}/beneficiaries/account/${accountId}`);
  },

  addBeneficiary: async (b: BeneficiaryDto): Promise<BeneficiaryDto> => {
    if (isMockMode) {
      const newB = { ...b, id: Date.now() };
      mockBeneficiaries.push(newB);
      return newB;
    }
    return await fetchJson(`${API_BASE_URL}/beneficiaries`, {
      method: 'POST',
      body: JSON.stringify(b)
    });
  },

  deleteBeneficiary: async (id: number): Promise<string> => {
    if (isMockMode) {
      mockBeneficiaries = mockBeneficiaries.filter(b => b.id !== id);
      return 'Beneficiary removed';
    }
    const res = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, { method: 'DELETE', credentials: 'include' });
    return await res.text();
  },

  getLoansForAccount: async (accountId: number): Promise<LoanDto[]> => {
    if (isMockMode) return mockLoans;
    return await fetchJson(`${API_BASE_URL}/loans/account/${accountId}`);
  },

  applyLoan: async (loan: LoanDto): Promise<LoanDto> => {
    if (isMockMode) {
      const newLoan: LoanDto = { ...loan, id: Date.now(), status: 'PENDING' };
      mockLoans.unshift(newLoan);
      return newLoan;
    }
    return await fetchJson(`${API_BASE_URL}/loans`, {
      method: 'POST',
      body: JSON.stringify(loan)
    });
  },

  approveLoan: async (loanId: number): Promise<LoanDto> => {
    if (isMockMode) {
      const l = mockLoans.find(x => x.id === loanId);
      if (!l) throw new Error('Loan application not found');
      l.status = 'APPROVED';
      return { ...l };
    }
    return await fetchJson(`${API_BASE_URL}/loans/${loanId}/approve`, {
      method: 'PUT'
    });
  },

  getAdminUsers: async (): Promise<UserResponseDto[]> => {
    if (isMockMode) {
      return [
        { id: 1, username: 'admin', role: 'ADMIN', enabled: true, createdAt: new Date().toISOString() },
        { id: 2, username: 'loan_officer_01', role: 'LOAN_OFFICER', enabled: true, createdAt: new Date().toISOString() }
      ];
    }
    return await fetchJson(`${API_BASE_URL}/admin/users`);
  },

  createAdminUser: async (user: CreateUserDto): Promise<UserResponseDto> => {
    if (isMockMode) {
      return { id: Date.now(), username: user.username, role: user.role, enabled: true, createdAt: new Date().toISOString() };
    }
    return await fetchJson(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  deleteAdminUser: async (id: number): Promise<string> => {
    if (isMockMode) return 'User account deleted';
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return 'User account deleted';
  }
};
