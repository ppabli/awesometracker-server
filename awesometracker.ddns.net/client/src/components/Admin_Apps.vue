<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true && apps.length != 0'>

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
						apps

					</div>

				</div>

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-md-end justify-content-center">

						<div class="col-2 justify-content-center align-items-center">

							<router-link class="btn btn-success" tag='button' :to="{path: `/dashboard/apps/addApp`}">

								<i class="fas fa-plus"></i>

							</router-link>

						</div>

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

					<caption>Apps</caption>

					<thead>

						<tr>

							<th @click="order($event, 'apps.code')">Code<i class="fas fa-sort float-right" id="searchIcon"></i></th>
							<th @click="order($event, 'apps.name')">Name</th>
							<th @click="order($event, 'apps.userCode')">User code</th>
							<th @click="order($event, 'users.user')">User name</th>
							<th @click="order($event, 'users.email')">User email</th>
							<th @click="order($event, 'status.name')">Status</th>
							<th @click="order($event, 'appCategories.name')">Category</th>
							<th @click="order($event, 'applications.registrationDate')">Registration date</th>
							<th @click="order($event, 'applications.lastUpdate')">Last update</th>
							<th>User</th>
							<th>App</th>
							<th>Edit</th>
							<th>Remove</th>

						</tr>

					</thead>

					<tbody>

						<tr v-for='(app, index) in apps.filter(app => String(app[orderBy]).toLowerCase().match(filter.toLowerCase())).slice(Number(pageSize) * Number(page), (Number(pageSize) * Number(page)) + Number(pageSize))' v-bind:key="index">

							<td>{{app['apps.code']}}</td>
							<td>{{app['apps.name']}}</td>
							<td>{{app['apps.userCode']}}</td>
							<td>{{app['users.user']}}</td>
							<td>{{app['users.email']}}</td>
							<td>{{app['status.name']}}</td>
							<td>{{app['appCategories.name']}}</td>
							<td>{{$functions.parseDate(app['apps.registrationDate'], true, true)}}</td>
							<td>{{$functions.parseDate(app['apps.lastUpdate'], true, true)}}</td>
							<td>

								<router-link class="btn btn-info" tag='button' :to="{path: `/dashboard/user/${app['apps.userCode']}`}">

									<i class="fas fa-user"></i>

								</router-link>

							</td>
							<td>

								<router-link class="btn btn-info" tag='button' :to="{path: `/dashboard/apps/${app['apps.code']}`}">

									<i class="fas fa-atom"></i>

								</router-link>

							</td>
							<td>

								<router-link class="btn btn-warning" tag='button' :to="{path: `/dashboard/apps/${app['apps.code']}/editApp`}">

									<i class="fas fa-edit"></i>

								</router-link>

							</td>

							<td><button class="btn btn-danger" @click="deleteApp(app)"><i class="fas fa-trash"></i></button></td>

						</tr>

					</tbody>

				</table>

			</div>

			<div class="row mt-3 m-0 p-0 justify-content-end align-items-center">

				<nav>

					<ul class="pagination justify-content-end">

						<li class="page-item" v-if='page - 1 >= 0'>

							<a class="page-link" @click='changePage(page - 1)'>Previous</a>

						</li>

						<li class="page-item active">

							<a class="page-link" @click='changePage(page)'>{{page + 1}}</a>

						</li>

						<li class="page-item" v-if='page + 1 < Math.ceil(apps.filter(app => String(app[orderBy]).toLowerCase().match(filter.toLowerCase())).length / Number(pageSize))'>

							<a class="page-link" @click='changePage(page + 1)'>Next</a>

						</li>

					</ul>

				</nav>

			</div>

		</div>

		<div v-else-if="ready == true">

			<div class="row justify-content-center">

				<div class="col-9">

					<div class="row m-3 align-items-center">

						<h2>0 apps</h2>

					</div>

				</div>

				<div class="col-3" v-if="users.length != 0">

					<div class="row m-3 align-items-center justify-content-end">

						<button class="btn btn-success float-right" @click="addApplication"><i class="fas fa-plus"></i></button>

					</div>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios';
	import Swal from 'sweetalert2';
	import Spinner from './Spinner.vue';

	export default {

		name: 'Admin_Apps',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,

				page: 0,
				pageSize: 10,

				orderBy: 'apps.code',
				filter: '',

				users: [],
				apps: [],

			}

		},
		methods: {

			order: async function(e, orderBy) {

				e.preventDefault();

				if (e.target.childNodes.length == 1) {

					document.getElementById('searchIcon').remove();

					let newNode = document.createElement('i');
					newNode.classList.add('fas', 'fa-sort', 'float-right');
					newNode.setAttribute('id', 'searchIcon');

					e.target.appendChild(newNode);

					let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?orderBy=${orderBy}`);

					this.orderBy = orderBy;

					if (result.data.status == 'ok') {

						this.apps = result.data.data;

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

			deleteApp: async function (app) {

				let sure = await Swal.fire({

					title: 'Are you sure?',
					text: "You won't be able to revert this!",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, delete it!'

				});

				if (sure.value) {

					let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteApp`, {appCode: app['apps.code'], userCode: app['apps.userCode']})

					if (result.data.status == 'ok') {

						let msg = result.data.msg;

						result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?orderBy=${this.orderBy}`);

						if (result.data.status == 'ok') {

							this.apps = result.data.data;

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

				}

			},

			changePage: function (page) {

				this.page = page;

			}

		},
		async created() {

			this.ready = false;

			this.apps = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?orderBy=apps.code`)

			if (result.data.status == 'ok') {

				this.apps = result.data.data;

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4`)

				if (result.data.status == 'ok') {

					this.users = result.data.data;

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
		updated() {

			if (this.page * this.pageSize > this.apps.filter(app => String(app[this.orderBy]).toLowerCase().match(this.filter.toLowerCase())).length) {

				this.page = 0;

			}

		}

	}

</script>

<style scoped>

</style>