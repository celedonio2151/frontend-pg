// import type { Role } from "pages/admin/users/interfaces/user.interface";

export interface UserLogin {
	myTokens: MyTokens;
	user: User;
	message: string;
}

export interface MyTokens {
	accessToken: string;
	refreshToken: string;
}

export interface User {
	createdAt:        Date;
	updatedAt:        Date;
	deletedAt:        null;
	_id:              string;
	ci:               number | null;
	name:             string;
	surname:          string;
	email:            string;
	codeVerification: null;
	emailVerified:    boolean;
	phoneNumber:      string | null;
	phoneVerified:    boolean;
	birthDate:        Date | null;
	profileImg:       string;
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
