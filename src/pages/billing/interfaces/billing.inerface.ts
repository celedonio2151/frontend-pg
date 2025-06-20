export interface Billings {
  limit:    number | undefined;
  offset:   number | undefined;
  total:    number;
  billings: Billing[];
}

export interface Billing {
  createdAt:        Date;
  updatedAt:        Date;
  deletedAt:        Date |null;
  _id:              string;
  min_cubic_meters: number;
  max_cubic_meters: number;
  base_rate:        number;
  rate:             number;
  description:      string;
}
