/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface LineChartProps {
	lineChartData: ApexAxisChartSeries;
	lineChartOptions: ApexOptions;
}

interface LineChartState {
	chartData: ApexAxisChartSeries;
	chartOptions: ApexOptions;
}

class LineChart extends Component<LineChartProps, LineChartState> {
	constructor(props: LineChartProps) {
		super(props);
		this.state = {
			chartData: props.lineChartData,
			chartOptions: props.lineChartOptions,
		};
	}

	componentDidUpdate(prevProps: LineChartProps) {
		if (
			prevProps.lineChartData !== this.props.lineChartData ||
			prevProps.lineChartOptions !== this.props.lineChartOptions
		) {
			this.setState({
				chartData: this.props.lineChartData,
				chartOptions: this.props.lineChartOptions,
			});
		}
	}

	render() {
		const { chartData, chartOptions } = this.state;
		return (
			<ReactApexChart
				options={chartOptions}
				series={chartData}
				type="area"
				width="100%"
				height="100%"
			/>
		);
	}
}

export default LineChart;
