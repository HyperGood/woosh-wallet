export interface Transaction {
  id: string;
  senderId: string;
  amount: string;
  token: string;
  depositIndex: number;
  sender: string;
  recipientName?: string;
  recipientPhone?: string;
  amountInUSD: number;
  claimed: boolean;
  claimedBy?: string;
  createdAt: any;
  claimedAt?: any;
  txId: string;
  description?: string;
}
