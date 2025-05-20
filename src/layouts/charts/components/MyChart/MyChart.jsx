import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Registrar los componentes requeridos de Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const ChartComponent = () => {
	// Datos del ejemplo
	const data = [
		{ date: "2024-01-20T12:56:20.000Z", cubicMeters: 5 },
		{ date: "2024-01-21T12:56:20.000Z", cubicMeters: 5 },
		{ date: "2024-01-22T12:56:20.000Z", cubicMeters: 5 },
		{ date: "2024-01-23T12:56:20.000Z", cubicMeters: 6 },
		{ date: "2024-01-24T12:56:20.000Z", cubicMeters: 6 },
		{ date: "2024-01-25T12:56:20.000Z", cubicMeters: 5 },
	];

	// Preparar los datos para el gráfico
	const chartData = {
		labels: data.map((entry) => new Date(entry.date).toLocaleDateString()), // Convertir las fechas a formato legible
		datasets: [
			{
				label: "Cubic Meters",
				data: data.map((entry) => entry.cubicMeters),
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				tension: 0.4,
			},
		],
	};

	// Opciones para personalizar el gráfico
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Cubic Meters Over Time",
			},
		},
	};

	return <Line data={chartData} options={options} />;
};

export default ChartComponent;
