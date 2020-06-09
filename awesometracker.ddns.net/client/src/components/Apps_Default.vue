<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if='ready == true && apps.length != 0'>

			<div class="row mt-3 align-items-center">

				<div class="col-9">

					Order by:
					<select v-model="orderBy" class="mr-1 ml-1" @change="order">

						<option value="apps.code">CODE</option>
						<option value="apps.name">NAME</option>
						<option value="appCategories.name">CATEGORY</option>
						<option value="status.name">STATUS</option>
						<option value="apps.token">TOKEN</option>
						<option value="apps.registrationDate">REGISTRATION</option>
						<option value="apps.lastUpdate">UPDATE</option>

					</select>

				</div>

				<div class="col-3" v-if="apps.length < $parent.$parent.$parent.user['userCategories.maximumApps']">

					<div class="row mr-3 align-items-center justify-content-end">

						<router-link class="btn btn-success" tag='button' :to="{path: `/dashboard/apps/addApp`}">

							<i class="fas fa-plus"></i>

						</router-link>

					</div>

				</div>

			</div>

			<div class="row m-0 p-0 justify-content-center">

				<div class="col-12 col-md-4 col-xl-2 mt-3" v-for="app in apps" v-bind:key="app">

					<div class="card" @click="seeApp(app)">

						<div class="card-header">

							<h5 class="text-center">{{app['apps.name']}}</h5>

						</div>

						<div class="card-body">

							<img class="app_img" v-bind:src="app['apps.imageURL']">

						</div>

					</div>

				</div>

			</div>

		</div>

		<div v-else-if="ready == true">

			<div class="row justify-content-center">

				<div class="col-9">

					<div class="row m-3 align-items-center">

						<h2>0 apps</h2>

					</div>

				</div>

				<div class="col-3">

					<div class="row m-3 align-items-center justify-content-end">

						<router-link class="btn btn-success" tag='button' :to="{path: `/dashboard/apps/addApp`}">

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

		name: 'Apps_Default',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,

				orderBy: 'apps.code',

				apps: []

			}

		},
		methods: {

			seeApp: function (app) {

				this.$router.push(`/dashboard/apps/${app['apps.code']}`);

			},

			order: async function () {

				let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/11?orderBy=${this.orderBy}`)

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

			}

		},
		async created() {

			this.ready = false;

			this.apps = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/11?orderBy=apps.code`)

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

			this.ready = true;

		}

	}

</script>

<style scoped>

	.app_img {

		width: 100%;
		height: 100%;

	}

</style>
