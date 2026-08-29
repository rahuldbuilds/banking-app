import type {
  AccountDto,
  CustomerDto,
  TransactionDto,
  TransferFundDto,
  BeneficiaryDto,
  LoanDto,
  LoginResponse
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

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
    try {
      return await fetchJson(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
    } catch {
      isMockMode = true;
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
  },

  logout: async (): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
      return await res.text();
    } catch {
      return 'Logged out from Demo mode';
    }
  },

  getAllAccounts: async (): Promise<AccountDto[]> => {
    try {
      return await fetchJson(`${API_BASE_URL}/accounts`);
    } catch {
      return [...mockAccounts];
    }
  },

  getAccountByNumber: async (accountNumber: string): Promise<AccountDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}`);
    } catch {
      const acc = mockAccounts.find(a => a.accountNumber === accountNumber);
      if (!acc) throw new Error('Account not found');
      return acc;
    }
  },

  createAccount: async (account: AccountDto): Promise<AccountDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/accounts`, {
        method: 'POST',
        body: JSON.stringify(account)
      });
    } catch {
      const newAcc: AccountDto = {
        ...account,
        id: Date.now(),
        accountNumber: account.accountNumber || `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        status: account.status || 'ACTIVE'
      };
      mockAccounts.unshift(newAcc);
      return newAcc;
    }
  },

  deposit: async (accountNumber: string, amount: number): Promise<AccountDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}/deposit`, {
        method: 'PUT',
        body: JSON.stringify({ amount })
      });
    } catch {
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
  },

  withdraw: async (accountNumber: string, amount: number): Promise<AccountDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}/withdraw`, {
        method: 'PUT',
        body: JSON.stringify({ amount })
      });
    } catch {
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
  },

  transfer: async (transferDto: TransferFundDto): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferDto)
      });
      if (!res.ok) throw new Error(await res.text());
      return 'Transfer successful';
    } catch (e: any) {
      if (isMockMode || e.message.includes('Failed to fetch')) {
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
      throw e;
    }
  },

  getTransactions: async (accountNumber: string): Promise<TransactionDto[]> => {
    try {
      return await fetchJson(`${API_BASE_URL}/accounts/${accountNumber}/transactions`);
    } catch {
      return [...mockTransactions];
    }
  },

  deleteAccount: async (accountNumber: string): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/${accountNumber}`, { method: 'DELETE' });
      return await res.text();
    } catch {
      mockAccounts = mockAccounts.filter(a => a.accountNumber !== accountNumber);
      return 'Account closed successfully';
    }
  },

  getCustomers: async (): Promise<CustomerDto[]> => {
    try {
      return await fetchJson(`${API_BASE_URL}/customers`);
    } catch {
      return [...mockCustomers];
    }
  },

  createCustomer: async (customer: CustomerDto): Promise<CustomerDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/customers`, {
        method: 'POST',
        body: JSON.stringify(customer)
      });
    } catch {
      const newCust: CustomerDto = { ...customer, id: Date.now() };
      mockCustomers.unshift(newCust);
      return newCust;
    }
  },

  getBeneficiaries: async (accountId: number): Promise<BeneficiaryDto[]> => {
    try {
      return await fetchJson(`${API_BASE_URL}/beneficiaries/account/${accountId}`);
    } catch {
      return mockBeneficiaries.filter(b => b.accountId === accountId);
    }
  },

  addBeneficiary: async (b: BeneficiaryDto): Promise<BeneficiaryDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/beneficiaries`, {
        method: 'POST',
        body: JSON.stringify(b)
      });
    } catch {
      const newB = { ...b, id: Date.now() };
      mockBeneficiaries.push(newB);
      return newB;
    }
  },

  deleteBeneficiary: async (id: number): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, { method: 'DELETE' });
      return await res.text();
    } catch {
      mockBeneficiaries = mockBeneficiaries.filter(b => b.id !== id);
      return 'Beneficiary removed';
    }
  },

  getLoansForAccount: async (accountId: number): Promise<LoanDto[]> => {
    try {
      return await fetchJson(`${API_BASE_URL}/loans/account/${accountId}`);
    } catch {
      return mockLoans;
    }
  },

  applyLoan: async (loan: LoanDto): Promise<LoanDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/loans`, {
        method: 'POST',
        body: JSON.stringify(loan)
      });
    } catch {
      const newLoan: LoanDto = { ...loan, id: Date.now(), status: 'PENDING' };
      mockLoans.unshift(newLoan);
      return newLoan;
    }
  },

  approveLoan: async (loanId: number): Promise<LoanDto> => {
    try {
      return await fetchJson(`${API_BASE_URL}/loans/${loanId}/approve`, {
        method: 'PUT'
      });
    } catch {
      const l = mockLoans.find(x => x.id === loanId);
      if (!l) throw new Error('Loan application not found');
      l.status = 'APPROVED';
      return { ...l };
    }
  }
};
