/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import MDTypography from "components/MDTypography";
import LineChart from "./components/Charts/LineCharts/LineChart";
import { Box, Card, Tabs, Tab, Paper } from "@mui/material";
import { lineChartDataDashboard } from "./data/lineChartData";
import { lineChartOptionsDashboard } from "./data/lineChartOptions";
import useFetch from "hooks/useFetch";
import { useEffect, useState } from "react";
import type { CubesMonth } from "./interfaces/interfaces";

export default function Charts() {
	const { sales, tasks } = reportsLineChartData;
	const [paramDates, setParamDates] = useState({
		startDate: new Date(new Date().getFullYear(), 0, 1),
		endDate: new Date(),
	});

	// Selected range for tabs: 'month' | '1' | '5' | '10' | '20' | '50'
	const [selectedRange, setSelectedRange] = useState<string>("1");
	const [currentYear, setCurrentYear] = useState({
		startDate: new Date("2025-05-01"),
		endDate: new Date(),
	});
	const [cubes, setCubes] = useState<ApexAxisChartSeries>([]);
	// helper to format dates as yyyy-mm-dd (backend-friendly)
	const formatDateParam = (d: Date) => d.toISOString().split("T")[0];

	const { data, loading, error } = useFetch<CubesMonth>({
		endpoint: `/report/sum-by-month/global?startDate=${formatDateParam(
			paramDates.startDate
		)}&endDate=${formatDateParam(paramDates.endDate)}`,
	});
	const {
		data: currentYearData,
		loading: loadinfCurrentYear,
		error: errorCurrentYear,
	} = useFetch<CubesMonth>({
		endpoint: `/report/sum-by-month/global?startDate=${formatDateParam(
			currentYear.startDate
		)}&endDate=${formatDateParam(currentYear.endDate)}`,
	});
	console.log("🚀 ~ Charts ~ data:", data);
	console.log("🚀 ~ Charts ~ currentData:", currentYearData);

	useEffect(() => {
		// build series safely when data arrives; allow either dataset to be present
		const series: ApexAxisChartSeries = [];

		if (data && data.readings) {
			series.push({
				name: `Rango seleccionado`,
				data: data.readings.map((r) => r.totalCubicMeters),
			});
		}

		if (currentYearData && currentYearData.readings) {
			series.push({
				name: `Año actual`,
				data: currentYearData.readings.map((r) => r.totalCubicMeters),
			});
		}

		if (series.length > 0) setCubes(series);
	}, [data, currentYearData]);

	// When selectedRange changes, compute new paramDates and set them
	useEffect(() => {
		const now = new Date();
		let start = new Date();
		let end = new Date();

		switch (selectedRange) {
			case "month":
				// last 1 month
				start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
				end = now;
				break;
			case "1":
				start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
				end = now;
				break;
			case "5":
				start = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
				end = now;
				break;
			case "10":
				start = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
				end = now;
				break;
			case "20":
				start = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate());
				end = now;
				break;
			case "50":
				start = new Date(now.getFullYear() - 50, now.getMonth(), now.getDate());
				end = now;
				break;
			default:
				start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
				end = now;
		}

		setParamDates({ startDate: start, endDate: end });
	}, [selectedRange]);
	return (
		<>
			<Box py={3}>
				{/* Range selector tabs */}
				<Card sx={{ mb: 2, p: 1 }}>
					<Tabs
						value={selectedRange}
						onChange={(e, v) => setSelectedRange(v)}
						variant="scrollable"
						scrollButtons
						allowScrollButtonsMobile
					>
						<Tab label="Mes" value="month" />
						<Tab label="1 año" value="1" />
						<Tab label="5 años" value="5" />
						<Tab label="10 años" value="10" />
						<Tab label="20 años" value="20" />
						<Tab label="50 años" value="50" />
					</Tabs>
					<Box sx={{ mt: 1, px: 2 }}>
						<MDTypography variant="caption" color="text">
							Rango: {formatDateParam(paramDates.startDate)} —{" "}
							{formatDateParam(paramDates.endDate)}
						</MDTypography>
					</Box>
				</Card>
				{/* <Grid container spacing={3}>
					<Grid item xs={12} md={6} lg={3}>
						<MDBox mb={1.5}>
							<ComplexStatisticsCard
								color="dark"
								icon="weekend"
								title="Bookings"
								count={281}
								percentage={{
									color: "success",
									amount: "+55%",
									label: "than lask week",
								}}
							/>
						</MDBox>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<MDBox mb={1.5}>
							<ComplexStatisticsCard
								icon="leaderboard"
								title="Today's Users"
								count="2,300"
								percentage={{
									color: "success",
									amount: "+3%",
									label: "than last month",
								}}
							/>
						</MDBox>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<MDBox mb={1.5}>
							<ComplexStatisticsCard
								color="success"
								icon="store"
								title="Revenue"
								count="34k"
								percentage={{
									color: "success",
									amount: "+1%",
									label: "than yesterday",
								}}
							/>
						</MDBox>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<MDBox mb={1.5}>
							<ComplexStatisticsCard
								color="primary"
								icon="person_add"
								title="Followers"
								count="+91"
								percentage={{
									color: "success",
									amount: "",
									label: "Just updated",
								}}
							/>
						</MDBox>
					</Grid>
				</Grid> */}
				<Box mt={4.5}>
					<Grid container spacing={3}>
						{/* <Grid item xs={12} md={6} lg={4}>
							<MDBox mb={3}>
								<ReportsBarChart
									color="info"
									title="website views"
									description="Last Campaign Performance"
									date="campaign sent 2 days ago"
									chart={reportsBarChartData}
								/>
							</MDBox>
						</Grid>
						<Grid item xs={12} md={6} lg={12}>
							<MDBox mb={3}>
								<ReportsLineChart
									color="success"
									title="daily sales"
									description={
										<>
											(<strong>+15%</strong>) increase in today sales.
										</>
									}
									date="updated 4 min ago"
									chart={sales}
								/>
							</MDBox>
						</Grid> */}
						{/* <Grid item xs={12} md={6} lg={12}>
							<MDBox mb={3}>
								<ReportsLineChart
									color="dark"
									title="completed tasks"
									description="Last Campaign Performance"
									date="just updated"
									chart={tasks}
								/>
							</MDBox>
						</Grid> */}
					</Grid>
				</Box>

				<MDBox sx={{ backgroundColor: "", mb: 3 }}>
					<Grid container spacing={3}>
						<Grid item xs={12} lg={12} xl={12}>
							<Card
								sx={{
									background: "rgb(0, 12, 36)",
									backgroundColor:
										"linear-gradient(90deg, rgba(0,12,36,1) 0%, rgba(0,96,149,1) 50%, rgba(0,212,255,1) 100%)",
									p: 2,
								}}
							>
								<Box sx={{ height: "100%" }}>
									<MDTypography
										variant="lg"
										color="white"
										fontWeight="bold"
										mb="5px"
									>
										Consumo de agua en Mosoj Llajta
									</MDTypography>
									<Box display="flex" alignItems="center" mb="40px">
										<MDTypography
											variant="button"
											color="success"
											fontWeight="bold"
										>
											+5% mas{" incremento de consumo "}
											<MDTypography
												variant="button"
												color="text"
												fontWeight="regular"
											>
												en 2022
											</MDTypography>
										</MDTypography>
									</Box>
									<MDBox sx={{ height: "310px" }}>
										<LineChart
											lineChartData={cubes}
											lineChartOptions={lineChartOptionsDashboard}
										/>
									</MDBox>
								</Box>
							</Card>
						</Grid>
					</Grid>
				</MDBox>
				{/* 
				<MDBox>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6} lg={8}>
							<Projects />
						</Grid>
						<Grid item xs={12} md={6} lg={4}>
							<OrdersOverview />
						</Grid>
					</Grid>
				</MDBox> */}
			</Box>
		</>
	);
}
