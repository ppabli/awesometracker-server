<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if="ready == true && app != null && categories.length != 0">

			<div class="row justify-content-center">

				<div class="col-12 col-md-4 col-xl-2 mt-3" v-for="(category, index) in categories.filter(category => category['appCategories.code'] < app['apps.categoryCode'])" v-bind:key="category">

					<div class="card text-center">

						<div class="card-header">

							<h6>{{category['appCategories.name']}}</h6>

						</div>

						<div class="card-body">

							<h6>Maximum calls: {{category['appCategories.maximumCalls'] != 0 ? category['appCategories.maximumCalls'] : 'Unlimited'}}</h6>

							<h6>Just: {{category['appCategories.price']}} €</h6>

						</div>

						<div class="card-footer">

							<button class="btn btn-success" @click="changeSelected($event, index)">Select this option</button>

						</div>

					</div>

				</div>

			</div>

			<div class="row p-0 m-0 mt-3 justify-content-center" v-if="selected != null">

				<div class="col-12 col-md-6 col-lg-4 rounded border border-info m-3 justify-content-center align-items-center">

					<h5 class="text-center">Actual app category</h5>

					<h6 class="text-center">{{app['appCategories.name']}}</h6>
					<h6 class="text-center">{{app['appCategories.description']}}</h6>
					<h6 class="text-center">Calls: {{app['appCategories.maximumCalls']}}/day</h6>
					<h6 class="text-center">Price: {{app['appCategories.price']}} €</h6>

				</div>

				<div class="col-12 col-md-6 col-lg-4 rounded border border-success m-3 justify-content-center align-items-center">

					<h5 class="text-center">Upgrade category</h5>

					<h6 class="text-center">{{categories[selected]['appCategories.name']}}</h6>
					<h6 class="text-center">{{categories[selected]['appCategories.description']}}</h6>
					<h6 class="text-center">Calls: {{categories[selected]['appCategories.maximumCalls'] != 0 ? categories[selected]['appCategories.maximumCalls'] + '/day' : 'Unlimited'}}</h6>
					<h6 class="text-center">Price: {{categories[selected]['appCategories.price']}} €</h6>

				</div>

				<div class="col-12 col-md-6 col-lg-4 m-3 justify-content-center align-items-center">

					<div id="paypal-button-container"></div>

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

		name: 'Apps_UpgradeApp',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,

				app: null,
				categories: [],

				selected: null

			}

		},
		methods: {

			changeSelected: function (e, index) {

				e.preventDefault();

				if (document.getElementById('paypal-button-container') && document.getElementById('paypal-button-container').childNodes) {

					document.getElementById('paypal-button-container').innerHTML = '';

				}

				if (this.selected == index) {

					this.selected = null;

					e.target.innerText  = 'Select this option';
					e.target.id  = '';

				} else {

					if (document.getElementById('selected')) {

						document.getElementById('selected').innerText = 'Select this option';
						document.getElementById('selected').id = '';

					}

					e.target.id = 'selected';
					e.target.innerText  = 'Selected';

					this.selected = index;

				}

			}

		},
		async created() {

			if (!window.paypal) {

				await Swal.fire({

					showConfirmButton: false,
					timer: 5000,
					title: 'Error PayPal',
					text: 'Unable to load PayPal API. Please disable any type of addblock',
					icon: 'error'

				});

				this.$router.go(-1);

				return;

			}

			this.ready = false;

			this.app = null;

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?where=apps.code=${this.$route.params.appCode}`);

			if (result.data.status == 'ok') {

				if (result.data.data.length == 1) {

					this.app = result.data.data[0];

					if (this.$parent.$parent.$parent.user['users.code'] != this.app['apps.userCode'] || this.app['apps.categoryCode'] <= 2) {

						this.$router.push(`/dashboard/apps/${this.$route.params.appCode}`);

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

				return;

			}

			this.categories = [];

			result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/13?orderBy=appCategories.code`);

			if (result.data.status == 'ok') {

				this.categories = result.data.data;
				this.categories.shift(1);

			}

			this.ready = true;

		},
		updated() {

			if (this.selected != null) {

				window.paypal.Buttons({

					createOrder: () => {

						return fetch(`/dashboard/user/${this.$parent.$parent.$parent.user['users.code']}/apps/${this.app['apps.code']}/upgradeApp/createAppTransaction`, {

							method: 'post',
							body: JSON.stringify({

								option: this.selected + 2

							}),
							headers: {

								'content-type': 'application/json'

							}

						}).then(res => {

							return res.json();

						}).then(async data => {

							if (data.status == 'ok') {

								return data.orderID;

							} else {

								return -1;

							}

						});

					},

					onApprove: async data => {

						return fetch(`/dashboard/user/${this.$parent.$parent.$parent.user['users.code']}/apps/${this.app['apps.code']}/upgradeApp/captureAppTransaction`, {

							method: 'post',
							headers: {

								'content-type': 'application/json'

							},
							body: JSON.stringify({

								orderID: data.orderID

							})

						}).then(async res => {

							return res.json();

						}).then(async data => {

							if (data.status == 'ok') {

								await Swal.fire({

									showConfirmButton: false,
									timer: 5000,
									title: 'Success',
									text: data.msg,
									icon: 'success'

								});

								this.$router.push(`/dashboard/apps/${this.app['apps.code']}`);

							} else {

								await Swal.fire({

									showConfirmButton: false,
									timer: 5000,
									title: 'Error',
									text: data.msg,
									icon: 'error'

								});

							}

						})

					},

					onError: async () => {

						await Swal.fire({

							showConfirmButton: false,
							timer: 5000,
							title: 'Error',
							text: 'Error',
							icon: 'error'

						});

						location.reload();

					},

					onCancel: async () => {

						await Swal.fire({

							showConfirmButton: false,
							timer: 5000,
							title: 'Operation cancelled',
							text: 'Operation cancelled. The operation has not been completed, app has not been modified',
							icon: 'info'

						});

					}

				}).render('#paypal-button-container');

			}

		}

	}

</script>

<style>

</style>