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

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default class LineChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			chartData: [],
			chartOptions: {},
		};
	}

	componentDidMount() {
		const { lineChartData, lineChartOptions } = this.props;

		this.setState({
			chartData: lineChartData,
			chartOptions: lineChartOptions,
		});
	}

	render() {
		return (
			<ReactApexChart
				options={this.state.chartOptions}
				series={this.state.chartData}
				type="area"
				width="100%"
				height="100%"
			/>
		);
	}
}

// export default function LineChart({ lineChartData, lineChartOptions }) {
// 	const [chartData, setChartData] = useState(lineChartData);
// 	const [chartOptions, setChartOptions] = useState(lineChartOptions);
// 	useEffect(() => {
// 		setChartData(lineChartData);
// 		setChartOptions(lineChartOptions);
// 	}, [lineChartData, lineChartOptions]);
// 	return (
// 		<ReactApexChart
// 			options={chartOptions}
// 			series={chartData}
// 			type="area"
// 			width="100%"
// 			height="100%"
// 		/>
// 	);
// }
