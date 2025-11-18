export interface WaterMeters {
  limit:       number | undefined;
  offset:      number | undefined;
  total:       number;
  waterMeters: WaterMeter[];
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
  _id:         string;
  ci:          number;
  name:        string;
  surname:     string;
  email:       string;
  phoneNumber: string;
  profileImg:  string;
  status:      boolean;
}

export type MeterForm = {
  user_id:      string;
  status:       boolean;
}

