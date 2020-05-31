<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true'>

			<div class="row justify-content-center">

				<Card v-bind:data="logs.length" title="Total logs"/>
				<Card v-bind:data="applications.length" title="Total applications"/>
				<Card v-bind:data="$functions.parseHours(logs.reduce((a, b) => {return a + b['trackerLogs.duration']}, 0))" title="Total time" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.mostUsedCategory(logs).category" title="Most used category" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.mostUsedApplication(logs).application" title="Most used application" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.todayApplications(applications)" title="Today applications"/>
				<Card v-bind:data="$functions.todayLogs(logs)" title="Today logs"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerDay(logs))" title="Average use per day" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerApplication(logs))" title="Average use per application" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerCategory(logs))" title="Average use per category" v-if="logs.length != 0"/>

			</div>

			<div class="row justify-content-around">

				<Card_Graph v-bind:title="'Use per day'" v-bind:cardID='1' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Use per category'" v-bind:cardID='2' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Use per application'" v-bind:cardID='3' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Applications and logs'" v-bind:cardID='4' v-if="logs.length != 0 &&  applications.length != 0"/>
				<Card_Graph v-bind:title="'Use per month'" v-bind:cardID='5' v-if="logs.length != 0"/>

			</div>

			<div class="row mt-3 justify-content-around">

				<Table v-bind:data="logs" v-bind:title="'Last 10 logs'" v-bind:rows="10" v-bind:type="'logs'" v-bind:direction="'reverse'" v-if="logs.length != 0"/>
				<Table v-bind:data="applications" v-bind:title="'Last 10 applications'" v-bind:rows="10" v-bind:type="'applications'" v-bind:direction="'reverse'" v-if="applications.length != 0"/>
				<Table v-bind:data="logsPerMonth" v-bind:title="'Logs per month'" v-bind:type="'logs_months'" v-if='logsPerMonth != null'/>
				<Table v-bind:data="applicationsPerMonth" v-bind:title="'Applications per month'" v-bind:type="'applications_months'" v-if='applicationsPerMonth != null'/>

			</div>

		</div>

		<div v-else-if="ready == true">

			<div class="row m-3 align-items-center">

				<h2>0 logs</h2>

			</div>

		</div>

	</div>

</template>

<script>

	import Chart from 'chart.js';
	import Axios from 'axios';
	import Swal from 'sweetalert2';

	import Spinner from './Spinner.vue';
	import Card from './Card.vue';
	import Card_Graph from './Card_Graph.vue';
	import Table from './Table.vue';

	export default {

		name: 'Metrics_Summary',
		components: {

			Spinner,
			Card,
			Card_Graph,
			Table

		},
		data() {

			return {

				ready: false,
				logs: [],
				applications: [],
				reverseLogs: [],
				charts: [],
				logsPerMonth: null,
				applicationsPerMonth: null,

			}

		},
		async created() {

			this.ready = false;

			this.logs = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/2?orderBy=trackerLogs.code`)

			if (result.data.status == 'ok') {

				this.logs = result.data.data
				this.reverseLogs = this.logs.slice(0).reverse();

			} else {

				await Swal.fire({

					showConfirmButton: false,
					timer: 5000,
					title: 'Invalid session',
					text: 'Redirecting',
					icon: 'warning'

				});

				this.$router.push('/login');

			}

			this.applications = [];

			result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/3?orderBy=applications.code`);

			if (result.data.status == 'ok') {

				this.applications = result.data.data;

			}

			this.logsPerMonth = this.$functions.logsPerMonth(this.logs);
			this.applicationsPerMonth = this.$functions.applicationsPerMonth(this.applications);

			this.ready = true;

		},
		async updated() {

			for (let chart in this.charts) {

				this.charts[chart].destroy();

			}

			let chart1Data = this.$functions.usePerDay(this.logs);
			let chart2Data = this.$functions.usePerCategory(this.logs);
			let chart3Data = this.$functions.usePerApplication(this.logs);
			let chart41Data = this.$functions.applicationsPerDay(this.applications);
			let chart42Data = this.$functions.logsPerDay(this.logs);
			let chart5Data = this.$functions.usePerMonth(this.logs);

			if (chart1Data) {

				let chart1Colors = this.$functions.randomColorArray(chart1Data.days.length);

				let chart1 = new Chart(document.getElementById("chart_1"), {

					type: 'line',
					data: {
						labels: chart1Data.days,
						datasets: [
							{
								label: 'Seconds',
								data: chart1Data.use,
								backgroundColor: chart1Colors,
								hoverBackgroundColor:chart1Colors,
								fill: origin
							}
						]
					},
					options: {
						responsive: true,
						legend: {
							display: true,
							position: 'top'
						},
						title: {
							display: true,
							text: 'Use per day | Seconds'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart1);

			}

			if (chart2Data) {

				let chart2Colors = this.$functions.randomColorArray(chart2Data.categories.length)

				let chart2 = new Chart(document.getElementById("chart_2"), {

					type: 'doughnut',
					data: {
						labels: chart2Data.categories,
						datasets: [
							{
								data: chart2Data.use,
								backgroundColor: chart2Colors,
								hoverBackgroundColor: chart2Colors
							}
						]
					},
					options: {
						responsive: true,
						legend: {
							display: true,
							position: 'top'
						},
						title: {
							display: true,
							text: 'Use per category'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart2);

			}

			if (chart3Data) {

				let chart3Colors = this.$functions.randomColorArray(chart3Data.applications.length)

				let chart3 = new Chart(document.getElementById("chart_3"), {

					type: 'bar',
					data: {
						labels: chart3Data.applications,
						datasets: [
							{
								label: "Seconds",
								data: chart3Data.use,
								backgroundColor: chart3Colors,
								hoverBackgroundColor: chart3Colors
							}
						]
					},
					options: {
						responsive: true,
						legend: {
							display: true,
							position: 'top'
						},
						title: {
							display: true,
							text: 'Use per app'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart3);

			}

			if (chart41Data && chart42Data) {

				let chart4 = new Chart(document.getElementById("chart_4"), {

					type: 'horizontalBar',
					data: {
						labels: chart41Data.days,
						datasets: [
							{
								label: "Applications",
								data: chart41Data.applications,
								backgroundColor:this.$functions.randomColor(),
								hoverBackgroundColor: this.$functions.randomColor()
							},
							{
								label: "Logs",
								data: chart42Data.logs,
								backgroundColor:this.$functions.randomColor(),
								hoverBackgroundColor: this.$functions.randomColor()
							}
						]
					},
					options: {
						responsive: true,
						elements: {

							rectangle: {

								borderWidth: 2

							}

						},
						legend: {
							display: true,
							position: 'right'
						},
						title: {
							display: true,
							text: 'Logs and applications per day'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart4);

			}

			if (chart5Data) {

				let chart5Colors = this.$functions.randomColorArray(chart5Data.months.length)

				let chart5 = new Chart(document.getElementById("chart_5"), {

					type: 'bar',
					data: {
						labels: chart5Data.months,
						datasets: [
							{
								label: "Seconds",
								data: chart5Data.use,
								backgroundColor: chart5Colors,
								hoverBackgroundColor: chart5Colors
							}
						]
					},
					options: {
						responsive: true,
						legend: {
							display: true,
							position: 'top'
						},
						title: {
							display: true,
							text: 'Use per month'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart5);

			}

		}

	}

</script>

<style scoped>

</style>
