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
