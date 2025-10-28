export interface MonthlyReport {
  period:  Period;
  total:   number;
  summary: Summary;
  reports: Report[];
}

export interface Period {
  startDate: Date;
  endDate:   Date;
}

export interface Report {
  date:        Date;
  cubicMeters: number;
  balance:     number;
  waterMeter:  WaterMeter;
  invoice:     Invoice | null;
}

export interface Invoice {
  status: boolean;
  isPaid: boolean;
}

export interface WaterMeter {
  ci:           number;
  meter_number: number
  name:         string;
  surname:      string;
}

export interface Summary {
  totalCubes:       number;
  totalBilled:      number;
  totalPaid:        number;
  pendingAmount:    number;
}


export interface AnnualReport {
  startDate:   Date;
  endDate:     Date;
  year:        number;
  summary:     Summary;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  mes:       string;
  consumo:   number;
  facturado: number;
}

export interface Summary {
  totalConsumo:   number;
  totalFacturado: number;
}
