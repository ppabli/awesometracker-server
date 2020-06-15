<template>

	<div id="background" class="d-flex flex-column justify-content-center align-items-center">

		<div class="col-12 col-md-7 col-xl-3 bg-white rounded p-5">

			<div class="row justify-content-center align-items-center">

				<img id="logo" src="./assets/icon.png" alt="logo">
				<h2>AwesomeTracker</h2>

			</div>

			<div class="row justify-content-center mt-4">

				<h4>Recover account</h4>

			</div>

			<div class="row justify-content-center m-2">

				<form @submit="recoverAccount">

					<div class="form-group">

						<label for="user" class="sr-only">Email</label>
						<input type="text" id="user" class="form-control" placeholder="Email addres or user" required>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col">

								<label for="password1" class="sr-only">New Password</label>
								<input type="password" id="password1" class="form-control" placeholder="New password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" required>

							</div>

							<div class="col">

								<label for="password2" class="sr-only">New password confirm</label>
								<input type="password" id="password2" class="form-control" placeholder="New password (confirm)" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" required>

							</div>

						</div>

						<small class="form-text text-muted text-center">Uppercase, lowercase, numbers, non alphanumeric characters and minimum 8 characters.</small>

					</div>

					<div class="form-group">

						<label for="recoverCode" class="sr-only">Recover code</label>
						<input type="text" id="recoverCode" class="form-control" placeholder="Recover code" minlength="15" maxlength="15" required>

					</div>

					<input type="hidden" id="recoverURLCode" class="form-control" v-model='this.$route.query.recoverURLCode' required>

					<button type="submit" class="btn btn-block btn-success mb-2">Update account</button>

				</form>

			</div>

			<nav class="row justify-content-around mt-4">

				<a href="" data-toggle="modal" data-target="#terms">Terms of use</a>
				<a href="" data-toggle="modal" data-target="#privacy">Privacy policy</a>

			</nav>

		</div>

		<div class="modal fade" id="terms" tabindex="-1" role="dialog" aria-hidden="true">

			<div class="modal-dialog modal-lg" role="document">

				<div class="modal-content">

					<div class="modal-header">

						<h5 class="modal-title">Terms of use</h5>

						<button type="button" class="close" data-dismiss="modal" aria-label="Close">

							<span aria-hidden="true">&times;</span>

						</button>

					</div>

					<div class="modal-body">

						<Terms/>

					</div>

				</div>

			</div>

		</div>

		<div class="modal fade" id="privacy" tabindex="-1" role="dialog" aria-hidden="true">

			<div class="modal-dialog modal-lg" role="document">

				<div class="modal-content">

					<div class="modal-header">

						<h5 class="modal-title">Privacy policy</h5>

						<button type="button" class="close" data-dismiss="modal" aria-label="Close">

							<span aria-hidden="true">&times;</span>

						</button>

					</div>

					<div class="modal-body">

						<Privacy/>

					</div>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	import Swal from 'sweetalert2';
	import Axios from 'axios';
	import Terms from './components/Doc_Terms';
	import Privacy from './components/Doc_Privacy';

	export default {

		name: 'RecoverAccount',
		components: {

			Terms,
			Privacy

		},
		methods: {

			recoverAccount: async function (e) {

				try {

					e.preventDefault();

					let ok = true
					let message = ''
					let passwords = [];

					for (let i = 0; i < document.forms[0].length - 1; i++) {

						if (document.forms[0].elements[i].value == '') {

							ok = false;
							message = 'Miss some data';
							break;

						}

						if (/email/.test(document.forms[0].elements[i].id)) {

							if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.forms[0].elements[i].value))) {

								ok = false;
								message = 'Invalid email';
								break;

							}

						}

						if (/password/.test(document.forms[0].elements[i].id)) {

							if (!(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(document.forms[0].elements[i].value))) {

								ok = false;
								message = 'Invalid password';
								break;

							}

							passwords.push(document.forms[0].elements[i].value);

							if (passwords.length == 2) {

								if (passwords[0] != passwords[1]) {

									ok = false;
									message = 'Passwords dont match';
									break;

								}

							}

						}

						if (/recoverCode/.test(document.forms[0].elements[i].id)) {

							if (document.forms[0].elements[i].value.length != 15) {

								ok = false;
								message = 'Invalid verification code';
								break;

							}

						}

					}

					if (ok) {

						let result = await Axios.post(`https://awesometracker.ddns.net/recoverUser`, {user: document.forms[0].elements['user'].value, password: document.forms[0].elements['password2'].value, recoverCode: document.forms[0].elements['recoverCode'].value, recoverURLCode: document.forms[0].elements['recoverURLCode'].value});

						if (result.data.status == 'ok') {

							await Swal.fire({

								timer: 3000,
								title: 'Done sucesfully',
								text: result.data.msg,
								icon: 'success'

							});

							this.$router.push('/login');

						} else {

							await Swal.fire({

								title: 'Error recovering account',
								text: result.data.msg,
								icon: 'error'

							});

						}

					} else {

						await Swal.fire({

							showConfirmButton: false,
							timer: 5000,
							title: 'Invalid values',
							text: message,
							icon: 'info'

						});

					}

				} catch (e) {

					await Swal.fire({

						showConfirmButton: false,
						timer: 5000,
						title: 'Some error',
						text: 'Error details: ' + e,
						icon: 'warning'

					});

				}

			}

		}

	}

</script>

<style scoped>

	#background {

		min-height: 100vh;
		background-image: linear-gradient(#84e8e8, #9BFF00);

	}

	#logo {

		width: 160px;
		height: 160px;

	}

</style>
