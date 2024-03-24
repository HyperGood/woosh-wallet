export interface Transaction {
  id: string;
  senderId: string;
  amount: string;
  token: string;
  depositIndex: number;
  sender: string;
  senderAddress: string;
  recipientName?: string;
  recipientInfo?: string;
  recipientPhone?: string;
  amountInUSD: number;
  transactionHash: string;
  claimed: boolean;
  claimedBy?: string;
  createdAt: any;
  claimedAt?: any;
  txId: string;
  description?: string;
  type: 'ethAddress' | 'depositVault';
}
