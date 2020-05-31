<template>

	<div id="background" class="d-flex flex-column justify-content-center align-items-center">

		<div class="col-12 col-md-7 col-xl-3 bg-white rounded p-5">

			<div class="row justify-content-center align-items-center">

				<img id="logo" src="./assets/icon.png" alt="logo">
				<h2> AwesomeTracker</h2>

			</div>

			<div class="row justify-content-center mt-4">

				<h4>Forgot password</h4>

			</div>

			<div class="row justify-content-center m-2">

				<form @submit="forgotPassword" class="col-12">

					<div class="form-group">

						<label for="user" class="sr-only">Email</label>
						<input type="text" id="user" class="form-control" placeholder="Email address or user" required>

					</div>

					<button type="submit" class="btn btn-block btn-success mb-2">Send recover email</button>

				</form>

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

	import Swal from 'sweetalert2'
	import Axios from 'axios'
	import Terms from './components/Doc_Terms'
	import Privacy from './components/Doc_Privacy'

	export default {

		name: 'ForgotPassword',
		components: {

			Terms,
			Privacy

		},
		methods: {

			forgotPassword: async function (e) {

				e.preventDefault();

				let user = document.getElementById('user').value;

				if (user != '') {

					let result = await Axios.post(`https://awesometracker.ddns.net/forgotPassword`, {user: user});

					if (result.data.status == 'ok') {

						await Swal.fire({

							title: 'Done sucesfully',
							text: result.data.msg,
							icon: 'success'

						});

					} else {

						await Swal.fire({

							title: 'Something go wrong',
							text: result.data.msg,
							icon: 'error'

						});

					}

				} else {

					await Swal.fire({

						title: 'Invalid values',
						text: 'User or email could not be empty',
						icon: 'info'

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
