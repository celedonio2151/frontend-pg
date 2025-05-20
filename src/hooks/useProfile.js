import React, { useState } from "react";

export default function useProfile() {
	const getUserProfile = () => {
		const userProfile = JSON.parse(localStorage.getItem("userProfile"));
		if (userProfile) {
			return userProfile;
		}
		return userProfile?.null;
	};

	const [userProfile, setUserProfile] = useState(getUserProfile());

	const saveProfile = (userProfile) => {
		setUserProfile(userProfile);
		localStorage.setItem("userProfile", JSON.stringify(userProfile));
	};
	return { userProfile, setProfile: saveProfile };
}
