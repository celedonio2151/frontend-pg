export interface Readings {
  limit?:   number;
  offset?:  number;
  total:    number;
  readings: Reading[];
}

export interface Invoice {
  createdAt:    Date;
  updatedAt:    Date;
  deletedAt:    null;
  _id:          string;
  amountDue:    number;
  isPaid:       boolean;
  status:       boolean;
  meterReading: Reading;
}

export interface Reading {
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   null;
  _id:         string;
  date:        Date;
  beforeMonth: BeforeMonth;
  lastMonth:   LastMonth;
  cubicMeters: number;
  balance:     number;
  meterImage:  null;
  description: string;
  waterMeter?: WaterMeter;
  invoice?:    Invoice;
}

export interface BeforeMonth {
  date:       Date;
  meterValue: string;
}

export interface LastMonth {
  date:       Date;
  meterValue: number;
}

export interface WaterMeter {
  createdAt:    Date;
  updatedAt:    Date;
  deletedAt:    null;
  _id:          string;
  ci:           number;
  name:         string;
  surname:      string;
  meter_number: number;
  status:       boolean;
}
