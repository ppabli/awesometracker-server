<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true && logs.length != 0'>

			<div class="row mt-3 justify-content-between align-items-center">

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-center align-items-center">

						Show
						<select v-model='pageSize' class="mr-1 ml-1">

							<option>10</option>
							<option>25</option>
							<option>50</option>
							<optio>100</optio>
							<option>150</option>

						</select>
						logs

					</div>

				</div>

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-md-end justify-content-center">

						<div class="col-10">

							<div class="input-group">

								<div class="input-group-prepend">

									<div class="input-group-text">

										<i class="fas fa-search mr-2"></i>
										{{orderBy.split('.')[1].toUpperCase()}}

									</div>

								</div>

								<input type="text" class="form-control" placeholder="Search..." v-model="filter">

							</div>

						</div>

					</div>

				</div>

			</div>

			<div class="row m-0 p-0 mt-3 justify-content-around table-responsive">

				<table class="table table-hover">

					<caption>All registered logs</caption>

					<thead>

						<tr>

							<th @click='order($event, "trackerLogs.code")' id="orderBy">Code<i class="fas fa-sort float-right" id="searchIcon"></i></th>
							<th @click='order($event, "applications.app")'>App</th>
							<th @click='order($event, "applications.category")'>Category</th>
							<th @click='order($event, "trackerLogs.start")'>Start</th>
							<th @click='order($event, "trackerLogs.stop")'>Stop</th>
							<th @click='order($event, "trackerLogs.duration")'>Duration</th>
							<th>User</th>
							<th>Remove</th>

						</tr>

					</thead>

					<tbody>

						<tr v-for='(log, index) in logs.filter(log => String(log[orderBy]).toLowerCase().match(filter.toLowerCase())).slice(Number(pageSize) * Number(page), (Number(pageSize) * Number(page)) + Number(pageSize))' v-bind:key="index">

							<td>{{log['trackerLogs.code']}}</td>
							<td>{{log['applications.app']}}</td>
							<td>{{log['applications.category']}}</td>
							<td>{{$functions.parseDate(log['trackerLogs.start'], true, true)}}</td>
							<td>{{$functions.parseDate(log['trackerLogs.stop'], true, true)}}</td>
							<td>{{log['trackerLogs.duration']}}</td>
							<td><button class="btn btn-info" @click="seeUser(log)"><i class="fas fa-user"></i></button></td>
							<td><button class="btn btn-danger" @click="deleteLog(log)"><i class="fas fa-trash"></i></button></td>

						</tr>

					</tbody>

				</table>

			</div>

			<div class="row p-0 m-0 mt-3 justify-content-end align-items-center">

				<nav>

					<ul class="pagination justify-content-end">

						<li class="page-item" v-if='page - 1 >= 0'>

							<a class="page-link" @click='changePage(page - 1)'>Previous</a>

						</li>

						<li class="page-item active">

							<a class="page-link" @click='changePage(page)'>{{page + 1}}</a>

						</li>

						<li class="page-item" v-if='page + 1 < Math.ceil(logs.filter(log => String(log[orderBy]).toLowerCase().match(filter.toLowerCase())).length / Number(pageSize))'>

							<a class="page-link" @click='changePage(page + 1)'>Next</a>

						</li>

					</ul>

				</nav>

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

	import Axios from 'axios';
	import Swal from 'sweetalert2';
	import Spinner from './Spinner.vue';

	export default {

		name: 'Admin_Logs',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,

				page: 0,
				pageSize: 10,

				orderBy: 'trackerLogs.code',
				filter: '',

				logs: [],

			}

		},
		methods: {

			seeUser: function (log) {

				this.$router.push(`/dashboard/user/${log['trackerLogs.userCode']}`);

			},

			order: async function(e, orderBy) {

				e.preventDefault();

				if (e.target.childNodes.length == 1) {

					document.getElementById('searchIcon').remove()

					let newNode = document.createElement('i');
					newNode.classList.add('fas', 'fa-sort', 'float-right');
					newNode.setAttribute('id', 'searchIcon');

					e.target.appendChild(newNode);

					let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/5?orderBy=${orderBy}`);

					this.orderBy = orderBy;

					if (result.data.status == 'ok') {

						this.logs = result.data.data

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

				} else {

					this.logs.reverse();

				}

			},

			deleteLog: async function (log) {

				let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteLog`, {userCode: log['trackerLogs.userCode'], logCode: log['trackerLogs.code']})

				if (result.data.status == 'ok') {

					let msg = result.data.msg;

					result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/5?orderBy=${this.orderBy}`);

					if (result.data.status == 'ok') {

						this.logs = result.data.data

						await Swal.fire({

							toast: true,
							position: 'top-end',
							showConfirmButton: false,
							timer: 1000,
							title: msg,
							icon: 'success'

						});

					}

				} else {

					await Swal.fire({

						title: 'Error',
						text: result.data.msg,
						icon: 'error'

					});

				}

			},

			changePage: function (page) {

				this.page = page;

			}

		},
		async created() {

			this.ready = false;

			this.logs = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/5?orderBy=trackerLogs.code`)

			if (result.data.status == 'ok') {

				this.logs = result.data.data

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
		updated() {

			if (this.page * this.pageSize > this.logs.filter(log => String(log[this.orderBy]).toLowerCase().match(this.filter.toLowerCase())).length) {

				this.page = 0

			}

		}

	}

</script>

<style scoped>

</style>
