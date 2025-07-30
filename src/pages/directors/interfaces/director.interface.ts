import type { User } from "pages/users/interfaces/user.interface";

export interface Directors {
  limit?:     number;
  offset?:    number;
  total:      number;
  directors:  Director[];
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

export type DirectorForm = {
  userId:       string;
  startDate:    any;
  endDate:      any;
  positionRole: string;
  order:        number; 
  description:  string;
}