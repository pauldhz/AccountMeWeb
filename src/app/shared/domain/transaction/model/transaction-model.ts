export enum TransactionType {
  CREDIT, DEBIT
}

export interface Transaction {
  uuid: string;
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
