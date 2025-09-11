export interface ManyInvoices {
  total:            number;
  uniqueUsersCount: number;
  filters:          Filters;
  dateRange:        DateRange;
  invoices:         Invoice[];
}

export interface DateRange {
  earliest: Date;
  latest:   Date;
}

export interface Filters {
  ci:        number | null;
  startDate: Date | null;
  endDate:   Date | null;
}

export interface Invoice {
  createdAt:    Date;
  updatedAt:    Date;
  deletedAt:    null;
  _id:          string;
  amountDue:    number;
  isPaid:       boolean;
  status:       boolean;
  meterReading: MeterReading;
}

export interface MeterReading {
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   null;
  _id:         string;
  date:        Date;
  beforeMonth: Month;
  lastMonth:   Month;
  cubicMeters: number;
  balance:     number;
  meterImage:  null;
  description: string;
  waterMeter:  WaterMeter;
}

export interface Month {
  date:  Date;
  value: number;
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
