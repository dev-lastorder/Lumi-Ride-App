// src/features/wallet/services/wallet.service.ts
import { apiClient } from '@/src/lib/axios';

// ============================================
// WALLET API ENDPOINTS
// ============================================
const WALLET_ENDPOINTS = {
  BALANCE: '/api/v1/wallet/balance',
  TOPUP: '/api/v1/wallet/topup',
  TRANSACTION_HISTORY: '/api/v1/wallet/transaction-history',
  REQUEST_WITHDRAW: '/api/v1/wallet/request-withdraw',
  WITHDRAWAL_HISTORY: '/api/v1/wallet/withdrawl/history',
  PENDING_WITHDRAWALS: '/api/v1/wallet/withdrawl/get/pending',
};

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

export interface WalletBalance {
  totalBalanceInWallet: number;
}

export interface TopupRequest {
  amount: number;
}

export interface TopupResponse {
  message: string;
  balance: number;
}

export interface Transaction {
  type: 'Deposit' | 'Credit' | 'Withdrawal';
  amount: number;
  status: string;
  createdAt: string;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  offset: number;
  limit: number;
  isEnd: boolean;
}

export type TransactionFilterType = 'all' | 'deposit' | 'withdrawal';

// ============================================
// WALLET SERVICE FUNCTIONS
// ============================================

/**
 * Get current wallet balance
 */
export const getWalletBalance = async (): Promise<WalletBalance> => {
  const response = await apiClient.get<WalletBalance>(WALLET_ENDPOINTS.BALANCE);
  return response.data;
};

/**
 * Add funds to wallet (topup)
 */
export const topupWallet = async (amount: number): Promise<TopupResponse> => {
  const response = await apiClient.post<TopupResponse>(
    WALLET_ENDPOINTS.TOPUP,
    { amount }
  );
  return response.data;
};

/**
 * Get wallet transaction history with optional filter and pagination
 */
export const getTransactionHistory = async (
  filter?: TransactionFilterType,
  offset: number = 0,
  limit: number = 10
): Promise<TransactionHistoryResponse> => {
  const params: any = { offset, limit };
  
  // Only add filter if it's not 'all'
  if (filter && filter !== 'all') {
    params.filter = filter;
  }

  const response = await apiClient.get<TransactionHistoryResponse>(
    WALLET_ENDPOINTS.TRANSACTION_HISTORY,
    { params }
  );
  return response.data;
};

/**
 * Request withdrawal from wallet
 */
export const requestWithdrawal = async (amount: number) => {
  const response = await apiClient.post(
    WALLET_ENDPOINTS.REQUEST_WITHDRAW,
    { amount }
  );
  return response.data;
};