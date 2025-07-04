import { useState } from "react";

export default function useLocalStorage<T>(
	key: string,
	initialValue: T
): { storedValue: T; setValue: (value: T | null) => void } {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (err) {
			console.error("Error reading localStorage:", err);
			return initialValue;
		}
	});

	const setValue = (value: T | null) => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
			setStoredValue(value);
		} catch (err) {
			console.error("Error setting localStorage:", err);
		}
	};

	return { storedValue, setValue };
}
