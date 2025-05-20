export const rootPaths = {
	root: "/",
	pageRoot: "pages",
	authRoot: "auth",
	errorRoot: "error",
};

export default {
	dashboard: `/`,
	analytics: `/${rootPaths.pageRoot}/analytics`,

	userMe: `/${rootPaths.pageRoot}/user-me`,
	users: `/${rootPaths.pageRoot}/users`,
	createUser: `/${rootPaths.pageRoot}/create-user`,
	editUser: `/${rootPaths.pageRoot}/edit-user/:userId`,

	waterMeters: `/${rootPaths.pageRoot}/water-meters`,
	createWaterMeter: `/${rootPaths.pageRoot}/create-water-meter`,
	editWaterMeter: `/${rootPaths.pageRoot}/edit-water-meter/:waterMeterId`,

	billings: `/${rootPaths.pageRoot}/billings`,
	createBilling: `/${rootPaths.pageRoot}/create-billing`,
	editBilling: `/${rootPaths.pageRoot}/edit-billing/:billingId`,

	readings: `/${rootPaths.pageRoot}/readings`,
	createReading: `/${rootPaths.pageRoot}/create-reading`,
	editReading: `/${rootPaths.pageRoot}/edit-reading/:readingId`,

	roles: `/${rootPaths.pageRoot}/roles`,
	createRole: `/${rootPaths.pageRoot}/create-role`,
	editRole: `/${rootPaths.pageRoot}/edit-role/:roleId`,
	
	directors: `/${rootPaths.pageRoot}/directors`,
	createDirector: `/${rootPaths.pageRoot}/create-director`,
	editDirector: `/${rootPaths.pageRoot}/edit-director/:directorId`,

	invoice: `/${rootPaths.pageRoot}/invoice`,
	charts: `/${rootPaths.pageRoot}/charts`,

	signin: `/${rootPaths.authRoot}/signin`,
	signup: `/${rootPaths.authRoot}/signup`,
	resetPassword: `/${rootPaths.authRoot}/reset-password`,
	404: `/${rootPaths.errorRoot}/404`,
};
