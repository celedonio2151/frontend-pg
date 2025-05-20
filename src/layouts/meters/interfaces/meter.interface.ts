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
  ci:           number;
  name:         string;
  surname:      string;
  meter_number: number;
  status:       boolean;
}
