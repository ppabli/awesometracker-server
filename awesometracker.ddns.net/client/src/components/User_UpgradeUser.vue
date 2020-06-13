<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if="ready == true && user != null && categories.length != 0">

			<div class="row justify-content-center">

				<div class="col-12 col-md-4 col-xl-2 mt-3" v-for="(category, index) in categories.filter(category => category['userCategories.code'] < user['users.categoryCode'])" v-bind:key="category">

					<div class="card text-center">

						<div class="card-header">

							<h6>{{category['userCategories.name']}}</h6>

						</div>

						<div class="card-body">

							<h6>Maximum apps: {{category['userCategories.maximumApps'] != 0 ? category['userCategories.maximumApps'] : 'Unlimited'}}</h6>

							<h6>Just: {{category['userCategories.price']}} €</h6>

						</div>

						<div class="card-footer">

							<button class="btn btn-success" @click="changeSelected($event, index)">Select this option</button>

						</div>

					</div>

				</div>

			</div>

			<div class="row p-0 m-0 mt-3 justify-content-center" v-if="selected != null">

				<div class="col-12 col-md-6 col-lg-4 rounded border border-info m-3 justify-content-center align-items-center">

					<h5 class="text-center">Actual account category</h5>

					<h6 class="text-center">{{user['userCategories.name']}}</h6>
					<h6 class="text-center">{{user['userCategories.description']}}</h6>
					<h6 class="text-center">Apps: {{user['userCategories.maximumApps']}}</h6>
					<h6 class="text-center">Price: {{user['userCategories.price']}} €</h6>

				</div>

				<div class="col-12 col-md-6 col-lg-4 rounded border border-success m-3 justify-content-center align-items-center">

					<h5 class="text-center">Upgrade category</h5>

					<h6 class="text-center">{{categories[selected]['userCategories.name']}}</h6>
					<h6 class="text-center">{{categories[selected]['userCategories.description']}}</h6>
					<h6 class="text-center">Apps: {{categories[selected]['userCategories.maximumApps'] != 0 ? categories[selected]['userCategories.maximumApps'] : 'Unlimited'}}</h6>
					<h6 class="text-center">Price: {{categories[selected]['userCategories.price']}} €</h6>

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

		name: 'User_UpgradeUser',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,
				user: null,
				categories: [],

				selected: null

			}

		},
		methods: {

			changeSelected: function (e, index) {

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

			this.ready = false;

			this.user = null;

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/1?userCode=${this.$route.params.userCode}`);

			if (result.data.status == 'ok') {

				this.user = result.data.data[0];

				if (this.user['users.code'] != this.$route.params.userCode || this.user['users.categoryCode'] <= 2) {

					this.$router.push(`/dashboard/user/${this.$route.params.userCode}`);

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

			result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/9?orderBy=userCategories.code`);

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

						return fetch(`/dashboard/user/${this.user['users.code']}/upgradeUser/createUserTransaction`, {

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

						return fetch(`/dashboard/user/${this.user['users.code']}/upgradeUser/captureUserTransaction`, {

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

								let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/1?userCode=${this.$route.params.userCode}`);

								if (this.$parent.$parent.$parent.user['users.code'] == this.$route.params.userCode) {

									this.$parent.$parent.$parent.user = result.data.data[0];

								}

								this.$router.push(`/dashboard/user/${this.user['users.code']}`);

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
							text: 'Operation cancelled. The operation has not been completed, your account has not been modified',
							icon: 'info'

						});

					}

				}).render('#paypal-button-container');

			}

		}

	}

</script>

<style scoped>

</style>