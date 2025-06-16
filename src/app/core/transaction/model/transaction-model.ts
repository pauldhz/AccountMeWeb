export class TransactionsResult {
  transactions: Transaction[] | undefined;
}
export enum TransactionType {
  CREDIT, DEBIT
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  comment: string;
  additionalInformation?: AdditionalInformation;
}

export interface AdditionalInformation {
  category: string;
  subcategory: string;
  internalTransfer: boolean;
  accountTitle: string;
}
