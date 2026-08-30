export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export type UserRole =
  | 'ADMIN'
  | 'LOAN_OFFICER'
  | 'CASH_DEPOSITOR'
  | 'TRANSACTION_HANDLER'
  | 'ACCOUNT_CREATOR'
  | 'CUSTOMER';

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
  transactionType: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'TRANSFER_IN';
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  username: string;
  role: UserRole;
  message: string;
}

export interface CreateUserDto {
  username: string;
  password?: string;
  role: UserRole;
}

export interface UserResponseDto {
  id: number;
  username: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
}

export type ViewTab =
  | 'overview'
  | 'users'
  | 'accounts'
  | 'transfer'
  | 'beneficiaries'
  | 'loans'
  | 'customers'
  | 'transactions';
