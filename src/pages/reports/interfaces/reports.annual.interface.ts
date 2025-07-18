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
  ci:            number;
  name:          string;
  surname:       string;
  meter_number:  number;
  status:        boolean;
  meterReadings: MeterReading[];
}

export interface MeterReading {
  _id:         string;
  date:        Date;
  cubicMeters: number;
  balance:     number;
  invoice:     Invoice;
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
