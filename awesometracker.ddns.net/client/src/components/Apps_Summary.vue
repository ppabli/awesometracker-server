<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if="ready == true && apps.length != 0">

			<div class="row justify-content-center">

				<Card v-bind:data="$parent.$parent.$parent.user['userCategories.maximumApps'] != 0 ? apps.length + ' / ' + $parent.$parent.$parent.user['userCategories.maximumApps'] : apps.length" title="Your apps"/>
				<Card v-bind:data="users.length" title="Total users"/>
				<Card v-bind:data="logs.length" title="Total logs"/>
				<Card v-bind:data="applications.length" title="Total applications"/>
				<Card v-bind:data="apiCalls.length" title="Total API calls"/>
				<Card v-bind:data="$functions.todayUsers(users)" title="Today users"/>
				<Card v-bind:data="$functions.todayApplications(applications)" title="Today applications"/>
				<Card v-bind:data="$functions.todayLogs(logs)" title="Today logs"/>
				<Card v-bind:data="$functions.todayApiCalls(apiCalls)" title="Today API calls"/>
				<Card v-bind:data="$functions.mostUsedApp(apiCalls).app" title="Most used app" v-if="apiCalls.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerDay(logs))" title="Average use per day" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerApplication(logs))" title="Average use per application" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerCategory(logs))" title="Average use per category" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerUser(logs))" title="Average use per user" v-if="logs.length != 0"/>
				<Card v-bind:data="Math.round(apiCalls.length / apps.length)" title="Average API calls per app" v-if="apiCalls.length != 0 && apps.length != 0"/>
				<Card v-bind:data="Math.round(logs.length / users.length)" title="Average logs per user" v-if="logs.length != 0 && users.length != 0"/>
				<Card v-bind:data="Math.round(applications.length / users.length)" title="Average applications per user" v-if="applications.length != 0 && users.length != 0"/>

			</div>

			<div class="row justify-content-around">

				<Card_Graph v-bind:title="'Use per day'" v-bind:cardID='1' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Use per category'" v-bind:cardID='2' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Use per application'" v-bind:cardID='3' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Users per day'" v-bind:cardID='4' v-if="users.length != 0"/>
				<Card_Graph v-bind:title="'Apps per day'" v-bind:cardID='5' v-if="apps.length != 0"/>
				<Card_Graph v-bind:title="'Applications and logs'" v-bind:cardID='6' v-if="logs.length != 0 &&  applications.length != 0"/>
				<Card_Graph v-bind:title="'Use per month'" v-bind:cardID='7' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Calls per day'" v-bind:cardID='8' v-if="apiCalls.length != 0"/>
				<Card_Graph v-bind:title="'Calls per app'" v-bind:cardID='9' v-if="apiCalls.length != 0"/>
				<Card_Graph v-bind:title="'Users per month'" v-bind:cardID='10' v-if="users.length != 0"/>

			</div>

			<div class="row mt-3 justify-content-around">

				<Table v-bind:data="logs" v-bind:title="'Last 15 logs'" v-bind:rows="15" v-bind:type="'logs'" v-bind:direction="'reverse'" v-if="logs.length != 0"/>
				<Table v-bind:data="users" v-bind:title="'Last 15 users'" v-bind:rows="15" v-bind:type="'users'" v-bind:direction="'reverse'" v-if="users.length != 0"/>
				<Table v-bind:data="applications" v-bind:title="'Last 15 applications'" v-bind:rows="15" v-bind:type="'applications'" v-bind:direction="'reverse'" v-if="applications.length != 0"/>
				<Table v-bind:data="apps" v-bind:title="'Last 15 apps'" v-bind:rows="15" v-bind:type="'apps'" v-bind:direction="'reverse'" v-if="apps.length != 0"/>
				<Table v-bind:data="apiCalls" v-bind:title="'Last 15 API calls'" v-bind:rows="15" v-bind:type="'apiCalls'" v-bind:direction="'reverse'" v-if="apiCalls.length != 0"/>
				<Table v-bind:data="logsPerMonth" v-bind:title="'Logs per month'" v-bind:type="'logs_months'" v-if='logsPerMonth != null'/>
				<Table v-bind:data="appsPerMonth" v-bind:title="'Apps per month'" v-bind:type="'apps_months'" v-if='appsPerMonth != null'/>
				<Table v-bind:data="applicationsPerMonth" v-bind:title="'Applications per month'" v-bind:type="'applications_months'" v-if='applicationsPerMonth != null'/>
				<Table v-bind:data="apiCallsPerMonth" v-bind:title="'API calls per month'" v-bind:type="'apiCalls_months'" v-if='apiCallsPerMonth != null'/>

			</div>

		</div>

		<div v-else-if="ready == true">

			<div class="row m-3 align-items-center">

				<h2>0 apps</h2>

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

		name: 'Apps_Summary',
		components: {

			Spinner,
			Card,
			Card_Graph,
			Table

		},
		data() {

			return {

				ready: false,

				apps: [],
				apiCalls: [],
				users: [],
				logs: [],
				applications: [],
				charts: [],
				logsPerMonth: null,
				applicationsPerMonth: null,
				appsPerMonth: null,
				apiCallsPerMonth: null,

			}

		},
		async created () {

			this.ready = false;

			this.apps = [];
			this.applications = [];
			this.users = [];
			this.logs = [];
			this.apiCalls = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/11?orderBy=apps.code`)

			if (result.data.status == 'ok') {

				if (result.data.data.length != 0) {

					this.apps = result.data.data;

					result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=applications.code`);

					if (result.data.status == 'ok') {

						let applications = result.data.data;

						result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/5?orderBy=trackerLogs.code`);

						if (result.data.status == 'ok') {

							let logs = result.data.data;

							result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/16?orderBy=apiCalls.code`);

							if (result.data.status == 'ok') {

								let apiCalls = result.data.data;

								let users = [];

								result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?orderBy=users.code`);

								if (result.data.status == 'ok') {

									users = result.data.data;

									this.users = users.filter(user => this.apps.includes(user['users.appCode']));
									this.apiCalls = apiCalls.filter(call => this.apps.includes(call['apiCalls.appCode']));

									users = this.users.map(user => user['users.code']);

									this.applications = applications.filter(application => users.includes(application['applications.userCode']));
									this.logs = logs.filter(log => users.includes(log['trackerLogs.userCode']));

									this.logsPerMonth = this.$functions.logsPerMonth(this.logs);
									this.apiCallsPerMonth = this.$functions.apiCallsPerMonth(this.apiCalls);
									this.appsPerMonth = this.$functions.appsPerMonth(this.apps);
									this.applicationsPerMonth = this.$functions.applicationsPerMonth(this.applications);

								}

							}

						}

					}

				}

				this.ready = true;

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

		},
		async updated() {

			for (let chart in this.charts) {

				this.charts[chart].destroy();

			}

			let chart1Data = this.$functions.usePerDay(this.logs);
			let chart2Data = this.$functions.usePerCategory(this.logs);
			let chart3Data = this.$functions.usePerApplication(this.logs);
			let chart4Data = this.$functions.usersPerDay(this.users);
			let chart5Data = this.$functions.appsPerDay(this.apps);
			let chart61Data = this.$functions.applicationsPerDay(this.applications);
			let chart62Data = this.$functions.logsPerDay(this.logs);
			let chart7Data = this.$functions.usePerMonth(this.logs);
			let chart8Data = this.$functions.apiCallsPerDay(this.apiCalls);
			let chart9Data = this.$functions.apiCallsPerApp(this.apiCalls);
			let chart10Data = this.$functions.usersPerMonth(this.users);

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

			if (chart4Data) {

				let chart4 = new Chart(document.getElementById("chart_4"), {

					type: 'line',
					data: {
						labels: chart4Data.days,
						datasets: [
							{
								label: "Users",
								data: chart4Data.users,
								borderColor: this.$functions.randomColor(),
								fill: false,
								steppedLine: 'middle'
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
							text: 'Users per day'
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

				let chart5 = new Chart(document.getElementById("chart_5"), {

					type: 'line',
					data: {
						labels: chart5Data.days,
						datasets: [
							{
								label: "Apps",
								data: chart5Data.apps,
								borderColor: this.$functions.randomColor(),
								fill: false
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
							text: 'Apps per day'
						},
						animation: {

							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart5);

			}

			if (chart61Data && chart62Data) {

				let chart6 = new Chart(document.getElementById("chart_6"), {

					type: 'horizontalBar',
					data: {
						labels: chart61Data.days,
						datasets: [
							{
								label: "Applications",
								data: chart61Data.applications,
								backgroundColor:this.$functions.randomColor(),
								hoverBackgroundColor: this.$functions.randomColor()
							},
							{
								label: "Logs",
								data: chart62Data.logs,
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

				this.charts.push(chart6);

			}

			if (chart7Data) {

				let chart7Colors = this.$functions.randomColorArray(chart7Data.months.length)

				let chart7 = new Chart(document.getElementById("chart_7"), {

					type: 'bar',
					data: {
						labels: chart7Data.months,
						datasets: [
							{
								label: "Seconds",
								data: chart7Data.use,
								backgroundColor: chart7Colors,
								hoverBackgroundColor: chart7Colors
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

				this.charts.push(chart7);

			}

			if (chart8Data) {

				let chart8Colors = this.$functions.randomColorArray(chart8Data.days.length);

				let chart8 = new Chart(document.getElementById("chart_8"), {

					type: 'line',
					data: {
						labels: chart8Data.days,
						datasets: [
							{
								label: 'Calls',
								data: chart8Data.calls,
								backgroundColor: chart8Colors,
								hoverBackgroundColor:chart8Colors,
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
							text: 'Calls per day'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart8);

			}

			if (chart9Data) {

				let chart9Colors = this.$functions.randomColorArray(chart9Data.apps.length)

				let chart9 = new Chart(document.getElementById("chart_9"), {

					type: 'doughnut',
					data: {
						labels: chart9Data.apps,
						datasets: [
							{
								data: chart9Data.calls,
								backgroundColor: chart9Colors,
								hoverBackgroundColor: chart9Colors
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
							text: 'Calls per app'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart9);

			}

			if (chart10Data) {

				let chart10Colors = this.$functions.randomColorArray(chart10Data.months.length)

				let chart10 = new Chart(document.getElementById("chart_10"), {

					type: 'bar',
					data: {
						labels: chart10Data.months,
						datasets: [
							{
								label: "Users",
								data: chart10Data.users,
								backgroundColor: chart10Colors,
								hoverBackgroundColor: chart10Colors
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
							text: 'Users per months'
						},
						animation: {
							animateScale: true,
							animateRotate: true
						}
					}

				});

				this.charts.push(chart10);

			}

		}

	}

</script>

<style scoped>

</style>