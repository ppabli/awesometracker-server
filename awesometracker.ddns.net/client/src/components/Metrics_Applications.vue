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

						<div class="col-2">

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

							<th @click='order($event, "applications.code")'>Code<i class="fas fa-sort float-right" id="searchIcon"></i></th>
							<th @click='order($event, "applications.app")'>Application</th>
							<th @click='order($event, "applications.category")'>Category</th>
							<th @click='order($event, "applications.registrationDate")'>Registration date</th>
							<th @click="order($event, 'applications.lastUpdate')">Last update</th>
							<th>Edit</th>
							<th>Remove</th>

						</tr>

					</thead>

					<tbody>

						<tr v-for='(application, index) in applications.filter(application => String(application[orderBy]).toLowerCase().match(filter.toLowerCase())).slice(Number(pageSize) * Number(page), (Number(pageSize) * Number(page)) + Number(pageSize))' v-bind:key="index">

							<td>{{application['applications.code']}}</td>
							<td>{{application['applications.app']}}</td>
							<td>{{application['applications.category']}}</td>
							<td>{{$functions.parseDate(application['applications.registrationDate'], true, true)}}</td>
							<td>{{$functions.parseDate(application['applications.lastUpdate'], true, true)}}</td>
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

				<div class="col-3">

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
	import Swal from 'sweetalert2';
	import Spinner from './Spinner.vue';

	export default {

		name: 'Metrics_Applications',
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

				category: null,
				application: null,

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

					let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/3?orderBy=${orderBy}`)

					this.orderBy = orderBy;

					if (result.data.status == 'ok') {

						this.applications = result.data.data;

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
					html: "<label for='category' class='sr-only'>Category</label><input type='text' maxlength='250' id='category' class='form-control mt-2' placeholder='Category'><label for='application' class='sr-only'>Application</label><input type='text' maxlength='250' id='application' class='form-control mt-2' placeholder='Application'>",
					focusConfirm: false,
					showCancelButton: true,
					confirmButtonText: 'Save',
					confirmButtonColor: '#9BFF00',
					cancelButtonColor: '#FF0000',
					preConfirm: () => {

						return [

							this.category = document.getElementById('category').value.substring(0, 250),
							this.application = document.getElementById('application').value.substring(0, 250),

						]

					}

				});

				if (result.value) {

					if (this.category != '' && this.application != '') {

						let result = await Axios.post('https://awesometracker.ddns.net/dashboard/addApplication', {category: this.category, app: this.application});

						if (result.data.status == 'ok') {

							let msg = result.data.msg;

							result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/3?orderBy='${this.orderBy}'`)

							if (result.data.status == 'ok') {

								this.applications = result.data.data;

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

							} else {

								await Swal.fire({

									title: 'Error',
									text: result.data.msg,
									icon: 'error'

								});

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
					html: `<label for='category' class='sr-only'>Category</label><input type='text' maxlength="250" id='category' class='form-control mt-2' placeholder='Category' value='${application['applications.category']}'><label for='application' class='sr-only'>Application</label><input type='text' maxlength="250" id='application' class='form-control mt-2' placeholder='Application' value='${application['applications.app']}'>`,
					focusConfirm: false,
					showCancelButton: true,
					confirmButtonText: 'Save',
					confirmButtonColor: '#9BFF00',
					cancelButtonColor: '#FF0000',
					preConfirm: () => {

						return [

							this.category = document.getElementById('category').value.substring(0, 250),
							this.application = document.getElementById('application').value.substring(0, 250),

						]

					}

				});

				if (result.value) {

					if (this.category != '' && this.application != '') {

						let result = await Axios.post('https://awesometracker.ddns.net/dashboard/updateApplication', {applicationCode: application['applications.code'], 'applications.category': this.category, 'applications.app': this.application});

						if (result.data.status == 'ok') {

							let msg = result.data.msg;

							result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/3?orderBy=${this.orderBy}`)

							if (result.data.status == 'ok') {

								this.applications = result.data.data

								await Swal.fire({

									toast: true,
									position: 'top-end',
									showConfirmButton: false,
									timer: 1000,
									title: msg,
									icon: 'success'

								});

							}

							this.category = null;
							this.application = null;

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

				let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/deleteApplication`, {applicationCode: application['applications.code']});

				if (result.data.status == 'ok') {

					let msg = result.data.msg;

					result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/3?orderBy=${this.orderBy}`)

					if (result.data.status == 'ok') {

						this.applications = result.data.data;

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

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/3?orderBy=applications.code`)

			if (result.data.status == 'ok') {

				this.applications = result.data.data;

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

			if (this.page * this.pageSize > this.applications.filter(application => String(application[this.orderBy]).toLowerCase().match(this.filter.toLowerCase())).length) {

				this.page = 0;

			}

		}

	}

</script>

<style scoped>

</style>
