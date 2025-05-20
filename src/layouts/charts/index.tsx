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
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
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
import { Card } from "@mui/material";
import { lineChartDataDashboard } from "./data/lineChartData";
import { lineChartOptionsDashboard } from "./data/lineChartOptions";

export default function Charts() {
	const { sales, tasks } = reportsLineChartData;

	return (
		<>
			<MDBox py={3}>
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
				<MDBox mt={4.5}>
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
						</Grid> */}
						{/* <Grid item xs={12} md={6} lg={12}>
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
				</MDBox>

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
								<MDBox sx={{ height: "100%" }}>
									<MDTypography
										variant="lg"
										color="white"
										fontWeight="bold"
										mb="5px"
									>
										Consumo de agua en Mosoj Llajta
									</MDTypography>
									<MDBox display="flex" alignItems="center" mb="40px">
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
									</MDBox>
									<MDBox sx={{ height: "310px" }}>
										<LineChart
											lineChartData={lineChartDataDashboard}
											lineChartOptions={lineChartOptionsDashboard}
										/>
									</MDBox>
								</MDBox>
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
			</MDBox>
		</>
	);
}
