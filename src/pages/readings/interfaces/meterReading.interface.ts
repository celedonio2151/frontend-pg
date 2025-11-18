export interface Readings {
  limit?:   number;
  offset?:  number;
  total:    number;
  summary:  Summary;
  readings: Reading[];
}


interface Summary{
		read:     number,
		unread:   number,
		total:    number
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
  deletedAt:   Date | null;
  _id:         string;
  date:        Date;
  beforeMonth: BeforeMonth;
  lastMonth:   LastMonth;
  cubicMeters: number;
  balance:     number;
  meterImage:  string | null;
  description: string | null;
  waterMeter:  WaterMeter;
  invoice?:    Invoice;
}

export interface BeforeMonth {
  date:       Date;
  value:      number;
}

export interface LastMonth {
  date:       Date;
  value:      number;
}

export interface WaterMeter {
  createdAt:    Date;
  updatedAt:    Date;
  deletedAt:    null;
  _id:          string;
  meter_number: number;
  status:       boolean;
  user:         User;
}

export interface User {
  _id:          string;
  ci:           number;
  name:         string;
  surname:      string;
  phoneNumber:  string;
}

export type ReadingForm = {
  date:           Date;
  beforeMonth:    BeforeMonth;
  lastMonth:      number;
  cubicMeters:    number;
  balance:        number;
  description:    string;
  water_meterId:  string;
}