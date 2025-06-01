export interface Roles {
  limit?:  number;
  offset?: number;
  total:   number;
  roles:   Role[];
}

export interface Role {
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   Date | null;
  _id:         string;
  name:        string;
  description: string;
  status:      boolean;
}

export interface RoleForm {
  name:         string;
  description:  string;
  status:       boolean;
}