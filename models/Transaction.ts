export interface Transaction {
  id: string;
  senderId: string;
  amount: string;
  token: string;
  depositIndex: number;
  sender: string;
  senderAddress: string;
  recipientName?: string;
  recipientPhone?: string;
  amountInUSD: number;
  transactionHash: string;
  claimed: boolean;
  claimedBy?: string;
  createdAt: Date;
  claimedAt?: Date | null;
  txId: string;
  description?: string;
}
