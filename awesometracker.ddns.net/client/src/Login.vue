<template>

	<div id="background" class="d-flex flex-column justify-content-center align-items-center">

		<div class="col-12 col-md-7 col-xl-3 bg-white rounded p-5">

			<div class="row justify-content-center align-items-center">

				<img id="logo" src="./assets/icon.png" alt="logo">
				<h2> AwesomeTracker</h2>

			</div>

			<div class="row justify-content-center mt-4">

				<h4>Sign in</h4>

			</div>

			<div class="row justify-content-center">

				<div class="g-signin2" id="google-signin-button"></div>

			</div>

			<div class="row justify-content-center align-items-center">

				<p class="p-0 m-0">or</p>

			</div>

			<div class="row justify-content-center ml-2 mr-2">

				<form @submit="access" class="col-12">

					<div class="form-group">

						<label for="user" class="sr-only">Email or user</label>
						<input type="text" id="user" class="form-control" placeholder="Email address or user" required>

					</div>

					<div class="form-group mb-4">

						<label for="password" class="sr-only">Password</label>
						<input type="password" id="password" class="form-control" placeholder="Password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" required>

					</div>

					<button type="submit" class="btn btn-block btn-success mb-2">Login</button>

				</form>

			</div>

			<div class="row justify-content-center">

				<router-link class="m-2 disabled" to="/forgotPassword">

					Forgot password?

				</router-link>

			</div>

			<div class="row justify-content-center mt-4">

				<h4>Don't have an account?</h4>

			</div>

			<div class="row justify-content-center">

				<router-link class="m-2 disabled" to="/registry">

					<button type="button" class="btn btn-success"><i class="far fa-file-alt m-2"></i>Register here</button>

				</router-link>

			</div>

			<div class="row justify-content-around mt-4">

				<a href="" data-toggle="modal" data-target="#terms">Terms of use</a>
				<a href="" data-toggle="modal" data-target="#privacy">Privacy policy</a>

			</div>

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

		name: 'Login',
		components: {

			Terms,
			Privacy

		},
		methods: {

			onSignIn: async function(googleUser) {

				let id_token = googleUser.getAuthResponse().id_token;

				let result = await Axios.post(`https://awesometracker.ddns.net/accessGoogle`, {token: id_token});

				if (result.data.status == 'ok') {

					this.$router.push('/dashboard');

				} else {

					window.gapi.auth2.getAuthInstance().signOut();

					await Swal.fire({

						title: 'Error',
						text: result.data.msg,
						icon: 'info',

					});

				}

			},

			access: async function (e) {

				try {

					e.preventDefault();

					let user = document.getElementById('user').value;
					let password = document.getElementById('password').value;

					if (user != '' && password != '') {

						if (/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(password)) {

							let result = await Axios.post(`https://awesometracker.ddns.net/access`, {user: user, password: password});

							if (result.data.status == 'ok') {

								this.$router.push('/dashboard');

							} else {

								await Swal.fire({

									title: 'Invalid user or password',
									text: result.data.msg,
									icon: 'error'

								});

							}

						} else {

							await Swal.fire({

								title: 'Invalid password',
								text: 'Invalid password',
								icon: 'error'

							});

						}

					} else {

						await Swal.fire({

							title: 'Invalid values',
							text: 'User and password could not be empty',
							icon: 'info'

						});

					}

				} catch (e) {

					await Swal.fire({

						title: 'Some error',
						text: 'Error details: ' + e,
						icon: 'warning'

					});

				}

			}

		},
		async beforeCreate() {

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard`);
			if (result.request.responseURL == 'https://awesometracker.ddns.net/dashboard') {

				this.$router.push('/dashboard');

			}

		},
		mounted() {

			window.gapi.load('auth2', function() {

				window.auth2 = window.gapi.auth2.init({

					client_id: '503137303929-ps45q8ac1g9mu1s9h5dco9bg97petskb.apps.googleusercontent.com',
					fetch_basic_profile: true,
					scope: 'profile email https://www.googleapis.com/auth/user.birthday.read',

				});

			});

			window.gapi.signin2.render('google-signin-button', {

				scope: 'profile email https://www.googleapis.com/auth/user.birthday.read',
				onsuccess: this.onSignIn

			});

		},

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

	#imagen {

		width: 100%;
		height: 100%;

	}

</style>
