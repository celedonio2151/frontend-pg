export interface QRInvoice {
  bankBNB:   BankBNB;
  aditional: Aditional;
}

export interface Aditional {
  name:                 string;
  month:                Date;
  currency:             string;
  gloss:                string;
  amount:               number;
  expirationDate:       string;
  singleUse:            boolean;
  additionalData:       string;
  destinationAccountId: string;
}

export interface BankBNB {
  id:      string;
  qr:      string;
  success: boolean;
  message: string;
}
