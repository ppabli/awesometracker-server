<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true && users.length != 0'>

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
						users

					</div>

				</div>

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-md-end justify-content-center">

						<div class="col-2 justify-content-center align-items-center">

							<router-link class="btn btn-success" tag='button' :to="{path: `/dashboard/user/addUser`}">

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

					<caption>Users</caption>

					<thead>

						<tr>

							<th @click='order($event, "users.code")' id="orderBy">Code<i class="fas fa-sort float-right" id="searchIcon"></i></th>
							<th @click='order($event, "userCategories.name")'>Category</th>
							<th @click='order($event, "users.appCode")'>App code</th>
							<th @click='order($event, "apps.name")'>App</th>
							<th @click='order($event, "users.email")'>Email</th>
							<th @click='order($event, "users.user")'>User</th>
							<th @click='order($event, "users.name")'>Name</th>
							<th @click='order($event, "users.surname")'>Surname</th>
							<th @click='order($event, "users.registrationDate")'>Registration date</th>
							<th @click='order($event, "users.lastUpdate")'>Last update</th>
							<th @click='order($event, "users.birthDate")'>Birthdate</th>
							<th>User</th>
							<th>Edit</th>
							<th>Remove</th>

						</tr>

					</thead>

					<tbody>

						<tr v-for='(user, index) in users.filter(user => String(user[orderBy]).toLowerCase().match(filter.toLowerCase())).slice(Number(pageSize) * Number(page), (Number(pageSize) * Number(page)) + Number(pageSize))' v-bind:key="index">

							<td>{{user['users.code']}}</td>
							<td>{{user['userCategories.name']}}</td>
							<td>{{user['users.appCode']}}</td>
							<td>{{user['apps.name']}}</td>
							<td>{{user['users.email']}}</td>
							<td>{{user['users.user']}}</td>
							<td>{{user['users.name']}}</td>
							<td>{{user['users.surname']}}</td>
							<td>{{$functions.parseDate(user['users.registrationDate'], true, true)}}</td>
							<td>{{$functions.parseDate(user['users.lastUpdate'], true, true)}}</td>
							<td>{{$functions.parseDate(user['users.birthDate'], true, true)}}</td>
							<td>

								<router-link class="btn btn-info" tag='button' :to="{path: `/dashboard/user/${user['users.code']}`}">

									<i class="fas fa-user"></i>

								</router-link>

							</td>
							<td>

								<router-link class="btn btn-warning" tag='button' :to="{path: `/dashboard/user/${user['users.code']}/editUser`}">

									<i class="fas fa-user-edit"></i>

								</router-link>

							</td>
							<td><button class="btn btn-danger" @click="deleteUser(user)"><i class="fas fa-trash"></i></button></td>

						</tr>

					</tbody>

				</table>

			</div>

			<div class="row mt-3 p-0 m-0 justify-content-end align-items-center">

				<nav>

					<ul class="pagination justify-content-end">

						<li class="page-item" v-if='page - 1 >= 0'>

							<a class="page-link" @click='changePage(page - 1)'>Previous</a>

						</li>

						<li class="page-item active">

							<a class="page-link" @click='changePage(page)'>{{page + 1}}</a>

						</li>

						<li class="page-item" v-if='page + 1 < Math.ceil(users.filter(user => String(user[orderBy]).toLowerCase().match(filter.toLowerCase())).length / Number(pageSize))'>

							<a class="page-link" @click='changePage(page + 1)'>Next</a>

						</li>

					</ul>

				</nav>

			</div>

		</div>

		<div v-else>

			<div class="row">

				<div class="col-9">

					<div class="row m-3 align-items-center">

						<h2>0 users</h2>

					</div>

				</div>

				<div class="col-3" v-if="$parent.$parent.$parent.apps.length != 0">

					<div class="row m-3 align-items-center justify-content-end">

						<router-link class="btn btn-success" tag='button' :to="{path: `/dashboard/user/addUser`}">

							<i class="fas fa-plus"></i>

						</router-link>

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

		name: 'AppUsers',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,

				page: 0,
				pageSize: 10,

				orderBy: 'users.code',
				filter: '',

				users: [],

			}

		},
		methods: {

			deleteUser: async function (user) {

				let sure = await Swal.fire({

					title: 'Are you sure?',
					text: "You won't be able to revert this!",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes, delete it!'

				});

				if (sure.value) {

					let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteUser`, {userCode: user['users.code']});

					if (result.data.status == 'ok') {

						let msg = result.data.msg;

						result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?orderBy=${this.orderBy}`);

						if (result.data.status == 'ok') {

							let users = result.data.data;

							let apps = this.$parent.$parent.$parent.apps.map(app => app['apps.code']);

							this.users = users.filter(user => apps.includes(user['users.appCode']));

							await Swal.fire({

								tittle: 'Deleted!',
								text: msg,
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

			order: async function(e, orderBy) {

				e.preventDefault();

				if (e.target.childNodes.length == 1) {

					document.getElementById('searchIcon').remove()

					let newNode = document.createElement('i');
					newNode.classList.add('fas', 'fa-sort', 'float-right');
					newNode.setAttribute('id', 'searchIcon');

					e.target.appendChild(newNode);

					let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?orderBy${orderBy}`);

					if (result.data.status == 'ok') {

						let users = result.data.data;

						let apps = this.$parent.$parent.$parent.apps.map(app => app['apps.code']);

						this.users = users.filter(user => apps.includes(user['users.appCode']));

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

					this.users.reverse();

				}

			},

			changePage: function (page) {

				this.page = page;

			}

		},
		async created () {

			this.ready = false;

			this.users = [];

			if (this.$parent.$parent.$parent.apps.length != 0) {

				let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?orderBy=users.code`);

				if (result.data.status == 'ok') {

					let users = result.data.data;

					let apps = this.$parent.$parent.$parent.apps.map(app => app['apps.code']);

					this.users = users.filter(user => apps.includes(user['users.appCode']));

				}

			}

			this.ready = true;

		},
		updated() {

			if (this.page * this.pageSize > this.users.filter(user => String(user[this.orderBy]).toLowerCase().match(this.filter.toLowerCase())).length) {

				this.page = 0;

			}

		}

	}

</script>

<style scoped>

</style>