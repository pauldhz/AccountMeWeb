export interface Links {
  next: string;
  prev: string;
  first: string;
  last: string;
}

export interface Metadata {

}

export interface TransactionsResponse {
  transactions: Transaction[];
  links: Links;
  metadata: Metadata;
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
  label: string;
  additionalInformation?: AdditionalInformation;
}

export interface AdditionalInformation {
  category: string;
  subcategory: string;
  internalTransfer: boolean;
  accountTitle: string;
}
