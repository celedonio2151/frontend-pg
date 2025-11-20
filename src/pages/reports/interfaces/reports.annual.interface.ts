export interface ReportAnnualByMeter {
  period:   Period;
  year:     number;
  summary:  Summary;
  readings: Reading[];
}

export interface Period {
  startDate: Date;
  endDate:   Date;
}

export interface Reading {
  _id:           string;
  meter_number:  number;
  status:        boolean;
  user:          User;
  meterReadings: MeterReading[];
}

interface User {
  _id:     string;
  ci:      number;
  name:    string;
  surname: string;
  status:  boolean;
}
export interface MeterReading {
  _id:         string;
  date:        Date;
  cubicMeters: number;
  balance:     number;
  invoice:     Invoice | null;
}

export interface Invoice {
  _id:       string;
  amountDue: number;
  isPaid:    boolean;
  status:    boolean;
}

export interface Summary {
  totalMeters:   number;
  totalCubes:    number;
  totalBilled:   number;
  pendingAmount: number;
  paidAmount:    number;
}
