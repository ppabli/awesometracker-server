<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true && app != null && app["apps.visibility"] == "public"'>

			<div class="row m-0 p-0 mt-3 justify-content-around">

				<div class="col-12 rounded bg-light">

					<div class="row m-3 m-0 p-0 justify-content-around align-items-center">

						<div class="col-6 col-md-4 col-xl-2">

							<img id="app_img" v-bind:src="app['apps.imageURL']" alt="user_img">

						</div>

						<div class="col-12 col-md-8">

							<div class="row m-0 p-0 mt-3">

								<div class="col-12">

									<h5 class="m-2">Name: {{app['apps.name']}}</h5>

								</div>

								<div class="col-12" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN' || $parent.$parent.$parent.user['users.code'] == app['apps.userCode']">

									<div class="form-group m-2 mr-0">

										<div class="input-group d-flex align-items-center justify-content-between">

											<h6 class="mr-2">Token: </h6>

											<label for="apps.token" class="sr-only">Token</label>
											<input type="text" id="apps.token" class="form-control rounded-left" placeholder="Token" :value="app['apps.token'].replace(/./g, '*')" required disabled>

											<div class="input-group-append">

												<button class="btn btn-warning" @click="toggleToken"><i class="fas fa-eye"></i></button>
												<button class="btn btn-info" @click="copyToken"><i class="fas fa-copy"></i></button>

											</div>

										</div>

									</div>

								</div>

							</div>

							<div class="row mt-3 m-0 p-0 border-top">

								<div class="col-12">

									<h5 class="m-2">Joined: {{$functions.parseDate(app['apps.registrationDate'], true, true)}}</h5>

								</div>

								<div class="col-12">

									<h6 class="m-2">Last update: {{$functions.parseDate(app['apps.lastUpdate'], true, true)}}</h6>

								</div>

							</div>

							<div class="row mt-3 m-0 p-0 border-top">

								<div class="col-12">

									<h5 class="m-2">Category: {{app['appCategories.name']}}</h5>

								</div>

								<div class="col-12">

									<h6 class="m-2">Status: {{app['status.name']}}</h6>

								</div>

							</div>

							<div class="row mt-3 m-0 p-0 border-top pt-2 justify-content-center" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN' || app['apps.userCode'] == $parent.$parent.$parent.user['users.code']">

								<router-link class="btn btn-info m-1" tag='button' :to="{path: '/dashboard/user/' + app['apps.userCode']}">

									See owner user
									<i class="fas fa-user ml-2"></i>

								</router-link>

								<router-link class="btn btn-success m-1" tag='button' :to="{path: '/dashboard/apps/' + app['apps.code'] + '/upgradeApp'}" v-if="app['apps.userCode'] == $parent.$parent.$parent.user['users.code'] && app['apps.categoryCode'] > 2">

									Upgrade app
									<i class="fas fa-angle-double-up ml-2"></i>

								</router-link>

								<router-link class="btn btn-info m-1" tag='button' :to="{path: '/dashboard/apps/' + app['apps.code'] + '/editApp'}">

									Edit app
									<i class="fas fa-edit ml-2"></i>

								</router-link>

								<button class="btn btn-danger m-1" @click="deleteApp">Delete app<i class="fas fa-trash ml-2"></i></button>

							</div>

							<div class="row mt-3 m-0 p-0 border-top pt-2 justify-content-center" v-else>

								<router-link class="btn btn-info m-1" tag='button' :to="{path: '/dashboard/user/' + app['apps.userCode']}">

									See owner user
									<i class="fas fa-user ml-2"></i>

								</router-link>

							</div>

						</div>

					</div>

				</div>

			</div>

			<div class="row justify-content-center">

				<Card v-bind:data="users.length" title="Total users"/>
				<Card v-bind:data="logs.length" title="Total logs"/>
				<Card v-bind:data="applications.length" title="Total applications"/>
				<Card v-bind:data="apiCalls.length" title="Total API calls"/>
				<Card v-bind:data="$functions.todayUsers(users)" title="Today users"/>
				<Card v-bind:data="$functions.todayApplications(applications)" title="Today applications"/>
				<Card v-bind:data="$functions.todayLogs(logs)" title="Today logs"/>
				<Card v-bind:data="$functions.todayApiCalls(apiCalls)" title="Today API calls"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerDay(logs))" title="Average use per day" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerApplication(logs))" title="Average use per application" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerCategory(logs))" title="Average use per category" v-if="logs.length != 0"/>
				<Card v-bind:data="$functions.parseHours($functions.averageUsePerUser(logs))" title="Average use per user" v-if="logs.length != 0"/>
				<Card v-bind:data="Math.round(logs.length / users.length)" title="Average logs per user" v-if="logs.length != 0 && users.length != 0"/>
				<Card v-bind:data="Math.round(applications.length / users.length)" title="Average applications per user" v-if="applications.length != 0 && users.length != 0"/>

			</div>

			<div class="row justify-content-around">

				<Card_Graph v-bind:title="'Use per day'" v-bind:cardID='1' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Use per category'" v-bind:cardID='2' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Use per application'" v-bind:cardID='3' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Users per day'" v-bind:cardID='4' v-if="users.length != 0"/>
				<Card_Graph v-bind:title="'Applications and logs'" v-bind:cardID='5' v-if="logs.length != 0 &&  applications.length != 0"/>
				<Card_Graph v-bind:title="'Use per month'" v-bind:cardID='6' v-if="logs.length != 0"/>
				<Card_Graph v-bind:title="'Calls per day'" v-bind:cardID='7' v-if="apiCalls.length != 0"/>
				<Card_Graph v-bind:title="'Users per month'" v-bind:cardID='8' v-if="users.length != 0"/>

			</div>

			<div class="row mt-3 justify-content-around">

				<Table v-bind:data="logs" v-bind:title="'Last 15 logs'" v-bind:rows="15" v-bind:type="'logs'" v-bind:direction="'reverse'" v-if="logs.length != 0"/>
				<Table v-bind:data="users" v-bind:title="'Last 15 users'" v-bind:rows="15" v-bind:type="'users'" v-bind:direction="'reverse'" v-if="users.length != 0"/>
				<Table v-bind:data="applications" v-bind:title="'Last 15 applications'" v-bind:rows="15" v-bind:type="'applications'" v-bind:direction="'reverse'" v-if="applications.length != 0"/>
				<Table v-bind:data="apiCalls" v-bind:title="'Last 15 API calls'" v-bind:rows="15" v-bind:type="'apiCalls'" v-bind:direction="'reverse'" v-if="apiCalls.length != 0"/>
				<Table v-bind:data="logsPerMonth" v-bind:title="'Logs per month'" v-bind:type="'logs_months'" v-if='logsPerMonth != null'/>
				<Table v-bind:data="applicationsPerMonth" v-bind:title="'Applications per month'" v-bind:type="'applications_months'" v-if='applicationsPerMonth != null'/>
				<Table v-bind:data="apiCallsPerMonth" v-bind:title="'API calls per month'" v-bind:type="'apiCalls_months'" v-if='apiCallsPerMonth != null'/>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios';
	import Chart from 'chart.js';
	import Swal from 'sweetalert2';

	import Spinner from './Spinner.vue';
	import Card from './Card.vue';
	import Card_Graph from './Card_Graph.vue';
	import Table from './Table.vue';

	export default {

		name: 'Apps_App',
		components: {

			Spinner,
			Card,
			Card_Graph,
			Table

		},
		data() {

			return {

				ready: false,

				app: null,
				selected: false,

				apiCalls: [],
				users: [],
				logs: [],
				applications: [],
				charts: [],
				logsPerMonth: null,
				applicationsPerMonth: null,
				apiCallsPerMonth: null,

			}

		},
		methods: {

			copyToken: function (e) {

				e.preventDefault();

				let copyElement = document.createElement('input');
				copyElement.value = this.app['apps.token'];
				copyElement.id = 'copy';

				document.body.appendChild(copyElement);

				let copyText = document.getElementById("copy");
				copyText.select();
				copyText.setSelectionRange(0, 99999);

				document.execCommand("copy");

				document.getElementById('copy').remove();

			},

			toggleToken: function (e) {

				e.preventDefault();

				if (this.selected) {

					document.getElementById('apps.token').value = document.getElementById('apps.token').value.replace(/./g, '*');

					this.selected = !this.selected;

				} else {

					document.getElementById('apps.token').value = this.app['apps.token'];

					this.selected = !this.selected;

				}

			},

			deleteApp: async function (e) {

				e.preventDefault();

				let sure = await Swal.fire({

					title: 'Are you sure?',
					text: "You won't be able to revert this!",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, delete it!'

				});

				if (sure.value) {

					let result = null;

					if (this.$parent.$parent.$parent.user['userCategories.name'] != 'ADMIN') {

						result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteApp`, {appCode: this.app['apps.code']});

					} else {

						result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteApp`, {userCode: this.app['apps.userCode'], appCode: this.app['apps.code']});

					}

					if (result.data.status == 'ok') {

						await Swal.fire({

							title: 'Deleted!',
							text: result.data.msg,
							icon: 'success'

						});

						this.$router.go(-1);

					} else {

						await Swal.fire({

							title: 'Error',
							text: result.data.msg,
							icon: 'error'

						});

					}

				}

			},

		},
		async created() {

			this.ready = false;

			this.app = null;

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?where=apps.code=${this.$route.params.appCode}`);

			if (result.data.status == 'ok') {

				if (result.data.data.length == 1) {

					this.app = result.data.data[0];

					if (this.app['apps.visibility'] != 'public' && this.app['apps.userCode'] != this.$parent.$parent.$parent.user['users.code']) {

						await Swal.fire({

							showConfirmButton: false,
							timer: 5000,
							title: 'Private app',
							text: 'Redirecting',
							icon: 'info'

						});

						this.$router.go(-1);

					} else {

						this.applications = [];
						this.users = [];
						this.logs = [];
						this.apiCalls = [];

						result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=applications.code`);

						if (result.data.status == 'ok') {

							let applications = result.data.data;

							result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/5?orderBy=trackerLogs.code`);

							if (result.data.status == 'ok') {

								let logs = result.data.data;

								result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/16?where=apiCalls.appCode=${this.app['apps.code']}&orderBy=apiCalls.code`);

								if (result.data.status == 'ok') {

									this.apiCalls = result.data.data;

									let users = [];

									result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?where=users.appCode=${this.app['apps.code']}&orderBy=users.code`);

									if (result.data.status == 'ok') {

										this.users = result.data.data;

										users = this.users.map(user => user['users.code']);

										this.applications = applications.filter(application => users.includes(application['applications.userCode']));
										this.logs = logs.filter(log => users.includes(log['trackerLogs.userCode']));

										this.logsPerMonth = this.$functions.logsPerMonth(this.logs);
										this.apiCallsPerMonth = this.$functions.apiCallsPerMonth(this.apiCalls);
										this.applicationsPerMonth = this.$functions.applicationsPerMonth(this.applications);

										this.ready = true;

									}

								}

							}

						}

					}

				} else {

					this.$router.go(-1);

				}

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

			this.ready = true;

		},
		async updated() {

			for (let chart in this.charts) {

				this.charts[chart].destroy();

			}

			let chart1Data = this.$functions.usePerDay(this.logs);
			let chart2Data = this.$functions.usePerCategory(this.logs);
			let chart3Data = this.$functions.usePerApplication(this.logs);
			let chart4Data = this.$functions.usersPerDay(this.users);
			let chart51Data = this.$functions.applicationsPerDay(this.applications);
			let chart52Data = this.$functions.logsPerDay(this.logs);
			let chart6Data = this.$functions.usePerMonth(this.logs);
			let chart7Data = this.$functions.apiCallsPerDay(this.apiCalls);
			let chart8Data = this.$functions.usersPerMonth(this.users);

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

			if (chart51Data && chart52Data) {

				let chart5 = new Chart(document.getElementById("chart_5"), {

					type: 'horizontalBar',
					data: {
						labels: chart51Data.days,
						datasets: [
							{
								label: "Applications",
								data: chart51Data.applications,
								backgroundColor:this.$functions.randomColor(),
								hoverBackgroundColor: this.$functions.randomColor()
							},
							{
								label: "Logs",
								data: chart52Data.logs,
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

				this.charts.push(chart5);

			}

			if (chart6Data) {

				let chart6Colors = this.$functions.randomColorArray(chart6Data.months.length)

				let chart6 = new Chart(document.getElementById("chart_6"), {

					type: 'bar',
					data: {
						labels: chart6Data.months,
						datasets: [
							{
								label: "Seconds",
								data: chart6Data.use,
								backgroundColor: chart6Colors,
								hoverBackgroundColor: chart6Colors
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

				this.charts.push(chart6);

			}

			if (chart7Data) {

				let chart7Colors = this.$functions.randomColorArray(chart7Data.days.length);

				let chart7 = new Chart(document.getElementById("chart_7"), {

					type: 'line',
					data: {
						labels: chart7Data.days,
						datasets: [
							{
								label: 'Calls',
								data: chart7Data.calls,
								backgroundColor: chart7Colors,
								hoverBackgroundColor:chart7Colors,
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

				this.charts.push(chart7);

			}

			if (chart8Data) {

				let chart8Colors = this.$functions.randomColorArray(chart8Data.months.length)

				let chart8 = new Chart(document.getElementById("chart_8"), {

					type: 'bar',
					data: {
						labels: chart8Data.months,
						datasets: [
							{
								label: "Users",
								data: chart8Data.users,
								backgroundColor: chart8Colors,
								hoverBackgroundColor: chart8Colors
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

				this.charts.push(chart8);

			}

		}

	}

</script>

<style scoped>

	#app_img {

		width: 100%;
		height: 100%;

		border-radius: 50%;

	}

</style>