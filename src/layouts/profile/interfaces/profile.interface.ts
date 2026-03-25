export interface Profile {
    createdAt:     Date;
    updatedAt:     Date;
    deletedAt:     null;
    _id:           string;
    ci:            number;
    name:          string;
    surname:       string;
    email:         string;
    emailVerified: boolean;
    phoneNumber:   string;
    phoneVerified: boolean;
    birthDate:     null;
    profileImg:    string;
    accessToken:   string[];
    refreshToken:  string[];
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
