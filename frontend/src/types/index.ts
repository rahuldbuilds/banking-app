export type AccountStatus = 'ACTIVE' | 'CLOSED' | 'BLOCKED' | 'PENDING';

export interface AccountDto {
  id?: number;
  accountNumber: string;
  accountHolderName: string;
  balance: number;
  accountType: string;
  signatureImage?: string;
  status: AccountStatus;
}

export interface CustomerDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  aadharCardNo?: string;
  aadharCardPhoto?: string;
  personalPhoto?: string;
}

export interface TransactionDto {
  id?: number;
  accountId: number | string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  timestamp: string;
}

export interface TransferFundDto {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
}

export interface BeneficiaryDto {
  id?: number;
  accountId: number;
  targetAccountId: number;
  aliasName: string;
}

export interface LoanDto {
  id?: number;
  accountId: number;
  amount: number;
  interestRate: number;
  loanType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  username: string;
  role: 'ADMIN' | 'STAFF' | 'LOAN_OFFICER' | 'CUSTOMER';
  message: string;
}

export type ViewTab =
  | 'overview'
  | 'accounts'
  | 'transfer'
  | 'beneficiaries'
  | 'loans'
  | 'customers'
  | 'transactions';
