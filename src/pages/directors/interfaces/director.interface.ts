export interface Directors {
  limit?:     number;
  offset?:    number;
  total:     number;
  directors: Director[];
}

export interface Director {
  createdAt:    Date;
  updatedAt:    Date;
  _id:          string;
  startDate:    Date;
  endDate:      Date;
  positionRole: string;
  description:  string;
  user:         User;
}

export interface User {
  createdAt:        Date;
  updatedAt:        Date;
  deletedAt:        null;
  _id:              string;
  ci:               number;
  name:             string;
  surname:          string;
  email:            string;
  password:         string;
  codeVerification: null;
  emailVerified:    boolean;
  phoneNumber:      string;
  phoneVerified:    boolean;
  birthDate:        null;
  profileImg:       string;
  accessToken:      null;
  refreshToken:     null;
  authProvider:     string;
  status:           boolean;
  roles:            Role[];
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


export type DirectorForm = {
  userId:       string;
  startDate:    any;
  endDate:      any;
  positionRole: string;
  description:  string;
}