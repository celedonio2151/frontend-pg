export interface Users {
  limit: number;
  total: number;
  users: User[];
}

export interface User {
  createdAt:     Date;
  updatedAt:     Date;
  deletedAt:     Date | null;
  _id:           string;
  ci:            number | null;
  name:          string;
  surname:       string;
  email:         null | string;
  emailVerified: boolean;
  phoneNumber:   null | string;
  phoneVerified: boolean;
  birthDate:     Date | null;
  profileImg:    string;
  authProvider:  string;
  status:        boolean;
  roles:         Role[] | null;
  meters?:       string[];
}

export interface Role {
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   null;
  _id:         string;
  name:        string;
  description: string;
  status:      boolean;
}

export type UserForm = {
  ci:             number;
  name:           string;
  surname:        string;
  email?:         string;
  password?:      string;
  phoneNumber:    string;
  birthDate?:     Date;
  profileImg?:    string;
  meter_number?:  number;
  status?:        boolean;
  role_id:        string[];
  meters?:        string[];
}