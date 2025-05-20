export interface Users {
  limit: number;
  total: number;
  users: User[];
}

export interface User {
  createdAt:     Date;
  updatedAt:     Date;
  deletedAt:     null;
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
  roles:         Role[];
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
