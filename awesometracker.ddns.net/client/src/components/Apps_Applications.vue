<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true && applications.length != 0'>

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
						applications

					</div>

				</div>

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-md-end justify-content-center">

						<div class="col-2 justify-content-center align-items-center">

							<button class="btn btn-success" @click="addApplication"><i class="fas fa-plus"></i></button>

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

					<caption>Applications</caption>

					<thead>

						<tr>

							<th @click="order($event, 'applications.code')">Code<i class="fas fa-sort float-right" id="searchIcon"></i></th>
							<th @click="order($event, 'applications.userCode')">User code</th>
							<th @click="order($event, 'users.user')">User name</th>
							<th @click="order($event, 'users.email')">User email</th>
							<th @click="order($event, 'applications.category')">Category</th>
							<th @click="order($event, 'applications.app')">App</th>
							<th @click="order($event, 'applications.registrationDate')">Registration date</th>
							<th @click="order($event, 'applications.lastUpdate')">Last update</th>
							<th>User</th>
							<th>Edit</th>
							<th>Remove</th>

						</tr>

					</thead>

					<tbody>

						<tr v-for='(application, index) in applications.filter(application => String(application[orderBy]).toLowerCase().match(filter.toLowerCase())).slice(Number(pageSize) * Number(page), (Number(pageSize) * Number(page)) + Number(pageSize))' v-bind:key="index">

							<td>{{application['applications.code']}}</td>
							<td>{{application['applications.userCode']}}</td>
							<td>{{application['users.user']}}</td>
							<td>{{application['users.email']}}</td>
							<td>{{application['applications.category']}}</td>
							<td>{{application['applications.app']}}</td>
							<td>{{$functions.parseDate(application['applications.registrationDate'],true, true)}}</td>
							<td>{{$functions.parseDate(application['applications.lastUpdate'], true, true)}}</td>
							<td><button class="btn btn-info" @click="seeUser(application)"><i class="fas fa-user"></i></button></td>
							<td><button class="btn btn-warning" @click="editApplication(application)"><i class="fas fa-edit"></i></button></td>
							<td><button class="btn btn-danger" @click="deleteApplication(application)"><i class="fas fa-trash"></i></button></td>

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

						<li class="page-item" v-if='page + 1 < Math.ceil(applications.filter(application => String(application[orderBy]).toLowerCase().match(filter.toLowerCase())).length / Number(pageSize))'>

							<a class="page-link" @click='changePage(page + 1)'>Next</a>

						</li>

					</ul>

				</nav>

			</div>

		</div>

		<div v-else-if="ready == true">

			<div class="row">

				<div class="col-9">

					<div class="row m-3 align-items-center">

						<h2>0 applications</h2>

					</div>

				</div>

				<div class="col-3" v-if="users.length != 0">

					<div class="row m-3 align-items-center justify-content-end">

						<button class="btn btn-success" @click="addApplication"><i class="fas fa-plus"></i></button>

					</div>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios';
	import Swal from 'sweetalert2'
	import Spinner from './Spinner.vue';

	export default {

		name: 'Apps_Applications',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,

				page: 0,
				pageSize: 10,

				orderBy: 'applications.code',
				filter: '',

				applications: [],
				users: [],

				category: null,
				application: null,
				userCode: null

			}

		},
		methods: {

			seeUser: function (application) {

				this.$router.push(`/dashboard/user/${application['applications.userCode']}`);

			},

			order: async function(e, orderBy) {

				e.preventDefault();

				if (e.target.childNodes.length == 1) {

					document.getElementById('searchIcon').remove()

					let newNode = document.createElement('i');
					newNode.classList.add('fas', 'fa-sort', 'float-right');
					newNode.setAttribute('id', 'searchIcon');

					e.target.appendChild(newNode);

					let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=${orderBy}`)

					this.orderBy = orderBy;

					if (result.data.status == 'ok') {

						let users = this.users.map(user => user['users.code']);

						this.applications = result.data.data.filter(application => users.includes(application['applications.userCode']));

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

					this.applications.reverse();

				}

			},

			addApplication: async function () {

				let result = await Swal.fire({

					title: 'Create new application',
					html: `<label for='category' class='sr-only'>Category</label><input type='text' maxlength="250" id='category' class='form-control mt-2' placeholder='Category'><label for='application' class='sr-only'>Application</label><input type='text' maxlength="250" id='application' class='form-control mt-2' placeholder='Application'><label for='userCode' class='sr-only'>User</label><select id='userCode' class='form-control mt-2'>${this.users.map(user => `<option value="${user['users.code']}">${user['users.user']}</option>`)}`,
					focusConfirm: false,
					showCancelButton: true,
					confirmButtonText: 'Save',
					confirmButtonColor: '#9BFF00',
					cancelButtonColor: '#FF0000',
					preConfirm: () => {

						return [

							this.category = document.getElementById('category').value.substring(0, 250),
							this.application = document.getElementById('application').value.substring(0, 250),
							this.userCode = document.getElementById('userCode').value,

						]

					}

				});

				if (result.value) {

					if (this.category != '' && this.application != '' && this.userCode != '') {

						let result = await Axios.post('https://awesometracker.ddns.net/dashboard/addApplication', {category: this.category, app: this.application, userCode: this.userCode});

						if (result.data.status == 'ok') {

							let msg = result.data.msg;

							result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=${this.orderBy}`);

							if (result.data.status == 'ok') {

								let users = this.users.map(user => user['users.code']);

								this.applications = result.data.data.filter(application => users.includes(application['applications.userCode']));

								await Swal.fire({

									toast: true,
									position: 'top-end',
									showConfirmButton: false,
									timer: 1000,
									title: msg,
									icon: 'success'

								})

								this.category = null;
								this.application = null;
								this.userCode = null;

							}

						} else {

							await Swal.fire({

								title: 'Error',
								text: result.data.msg,
								icon: 'error'

							});

						}

					} else {

						await Swal.fire({

							title: 'Invalid values',
							icon: 'info'

						});

					}

				}

			},

			editApplication: async function (application) {

				let result = await Swal.fire({

					title: 'Edit application',
					html: `<label for='category' class='sr-only'>Category</label><input type='text' maxlength="250" id='category' class='form-control mt-2' placeholder='Category' value='${application['applications.category']}'><label for='application' class='sr-only'>Application</label><input type='text' maxlength="250" id='application' class='form-control mt-2' placeholder='Application' value='${application['applications.app']}'><label for='userCode' class='sr-only'>User</label><select id='userCode' class='form-control mt-2' value="${application['users.code']}">${this.users.map(user => `<option value="${user['users.code']}">${user['users.user']}</option>`)}`,
					focusConfirm: false,
					showCancelButton: true,
					confirmButtonText: 'Save',
					confirmButtonColor: '#9BFF00',
					cancelButtonColor: '#FF0000',
					preConfirm: () => {

						return [

							this.category = document.getElementById('category').value.substring(0, 250),
							this.application = document.getElementById('application').value.substring(0, 250),
							this.userCode = document.getElementById('userCode').value,

						]

					}

				});

				if (result.value) {

					if (this.category != '' && this.application != '') {

						let result = await Axios.post('https://awesometracker.ddns.net/dashboard/updateApplication', {userCode: application['applications.userCode'], applicationCode: application['applications.code'], 'applications.category': this.category, 'applications.app': this.application, 'applications.userCode': this.userCode});

						if (result.data.status == 'ok') {

							let msg = result.data.msg;

							result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=${this.orderBy}`);

							if (result.data.status == 'ok') {

								let users = this.users.map(user => user['users.code']);

								this.applications = result.data.data.filter(application => users.includes(application['applications.userCode']));

								await Swal.fire({

									toast: true,
									position: 'top-end',
									showConfirmButton: false,
									timer: 1000,
									title: msg,
									icon: 'success'

								});

								this.category = null;
								this.application = null;
								this.userCode = null;

							}

						} else {

							await Swal.fire({

								title: 'Error',
								text: result.data.msg,
								icon: 'error'

							});

						}

					} else {

						await Swal.fire({

							title: 'Invalid values',
							icon: 'info'

						});

					}

				}

			},

			deleteApplication: async function (application) {

				let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteApplication`, {userCode: application['applications.userCode'], applicationCode: application['applications.code']})

				if (result.data.status == 'ok') {

					let msg = result.data.msg;

					result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=${this.orderBy}`);

					if (result.data.status == 'ok') {

						let users = this.users.map(user => user['users.code']);

						this.applications = result.data.data.filter(application => users.includes(application['applications.userCode']));

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

			this.applications = [];
			this.users = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/7?orderBy=applications.code`);

			if (result.data.status == 'ok') {

				let applications = result.data.data;

				let users = [];
				let apps = [];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?orderBy=users.code`);

				if (result.data.status == 'ok') {

					users = result.data.data;

					apps = this.$parent.$parent.$parent.apps.map(app => app['apps.code']);

					this.users = users.filter(user => apps.includes(user['users.appCode']));

					users = this.users.map(user => user['users.code']);

					this.applications = applications.filter(application => users.includes(application['applications.userCode']));

					this.ready = true;

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

		},

		updated() {

			if (this.page * this.pageSize > this.applications.filter(application => String(application[this.orderBy]).toLowerCase().match(this.filter.toLowerCase())).length) {

				this.page = 0

			}

		}

	}

</script>

<style>

</style>