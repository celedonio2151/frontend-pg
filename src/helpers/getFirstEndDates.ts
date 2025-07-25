// Devuelve las fechas de inicio y fin del mes basado en la fecha proporcionada
export default function getFirstEndDates(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth();

	// Primer día del mes a las 00:00:00.000
	const startDate = new Date(year, month, 1, 0, 0, 0, 0);

	// Último día del mes a las 23:59:59.999
	const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
	console.log("Fechas locales: ", startDate, endDate);
	return {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	};
}

// Devuelve las fechas de inicio y fin del año basado en la fecha proporcionada
export function getFirstEndDatesYear(date: Date) {
	const year = date.getFullYear();

	// Primer día del año a las 00:00:00.000
	const startDate = new Date(year, 0, 1, 0, 0, 0, 0);

	// Último día del año a las 23:59:59.999
	const endDate = new Date(year + 1, 0, 0, 23, 59, 59, 999);
	console.log("Fechas locales: ", startDate, endDate);
	return {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	};
}
