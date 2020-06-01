<template>

	<div id="background" class="d-flex flex-column justify-content-center align-items-center">

		<div class="col-12 col-md-7 col-xl-3 bg-white rounded p-5">

			<div class="row justify-content-center align-items-center">

				<img id="logo" src="./assets/icon.png" alt="logo">
				<h2>AwesomeTracker</h2>

			</div>

			<div class="row justify-content-center mt-4">

				<h4>Create new account</h4>

			</div>

			<div class="row justify-content-center">

				<form @submit="createUser">

					<div class="form-group">

						<label for="users.user" class="sr-only">User</label>
						<input type="text" id="users.user" class="form-control" placeholder="User" maxlength='250' required>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="password1" class="sr-only">Password</label>
								<input type="password" id="password1" class="form-control" placeholder="Password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" maxlength='250' required>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="password2" class="sr-only">Password confirm</label>
								<input type="password" id="password2" class="form-control" placeholder="Password (confirm)" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" maxlength='250' required>

							</div>

						</div>

						<small class="form-text text-muted text-center">Uppercase, lowercase, numbers, non alphanumeric characters and minimum 8 characters.</small>

					</div>

					<div class="form-group">

						<label for="users.email" class="sr-only">Email</label>
						<input type="email" id="users.email" class="form-control" placeholder="Email" maxlength='250' required>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="users.name" class="sr-only">First name</label>
								<input type="text" id="users.name" class="form-control" placeholder="First name" maxlength='250' required>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="users.surname" class="sr-only">Last name</label>
								<input type="text" id="users.surname" class="form-control" placeholder="Last name" maxlength='250' required>

							</div>

						</div>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="birthDate" class="sr-only">Birth date</label>
								<input type="date" id="users.birthDate" class="form-control" placeholder="Birth date" required>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<div class="input-group">

									<div class="custom-file">

										<input type="file" class="custom-file-input" id="imageFile" @change="updateUploadImg">
										<label class="custom-file-label" for="imageFile">Choose file</label>

									</div>

									<div class="input-group-append">

										<button class="btn btn-danger" @click="clearFileInput"><i class="fas fa-trash"></i></button>

									</div>

								</div>

							</div>

						</div>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col justify-content-center align-items-center">

								<h5 class="text-center">User image</h5>

								<div id="uploadImgDiv" class="d-flex justify-content-center align-items-center">

									<img class="user_img" src="https://awesometracker.ddns.net/userImg/default.png">

								</div>

							</div>

						</div>

					</div>

					<button type="submit" class="btn btn-block btn-success mb-2">Create account</button>

				</form>

			</div>

			<div class="row justify-content-center mt-4 text-center">

				<h4>Already have an account?</h4>

			</div>

			<div class="row justify-content-center">

				<router-link class="m-2 disabled" to="/login">

					<button type="button" class="btn btn-success"><i class="far fa-file-alt m-2"></i>Login here</button>

				</router-link>

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

	import Swal from 'sweetalert2'
	import Axios from 'axios'
	import Terms from './components/Doc_Terms'
	import Privacy from './components/Doc_Privacy'

	export default {

		name: 'Registry',
		components: {

			Terms,
			Privacy

		},
		methods: {

			clearFileInput: function (e) {

				e.preventDefault();

				document.getElementById('imageFile').value = '';
				this.updateUploadImg();

			},

			clearURLInput: function (e) {

				e.preventDefault();

				document.getElementById('users.imageURL').value = '';
				this.updateUploadImg();

			},

			updateUploadImg: async function () {

				try {

					let validExtensions = ['gif', 'jpeg', 'jpg', 'png'];

					if (document.getElementById('imageFile').files[0]) {

						let file = document.getElementById('imageFile');
						let extension = file.files[0].name.split('.')[file.files[0].name.split('.').length - 1];

						if (validExtensions.includes(extension)) {

							let reader = new FileReader();

							reader.onload = function() {

								document.getElementById('uploadImgDiv').childNodes[0].remove();

								let imgNode = document.createElement('img');
								imgNode.classList.add('user_img');
								imgNode.src = reader.result;

								document.getElementById('uploadImgDiv').appendChild(imgNode);

							};

							reader.readAsDataURL(file.files[0]);

						} else {

							throw new Error();

						}

					} else {

						document.getElementById('uploadImgDiv').childNodes[0].remove();

						let imgNode = document.createElement('img');
						imgNode.classList.add('user_img');
						imgNode.src = 'https://awesometracker.ddns.net/userImg/default.png';

						document.getElementById('uploadImgDiv').appendChild(imgNode);

					}

				} catch (e) {

					document.getElementById('uploadImgDiv').childNodes[0].remove();

					let textNode = document.createElement('h5');
					let text = document.createTextNode('Invalid URL or file provided');
					textNode.appendChild(text);

					document.getElementById('uploadImgDiv').appendChild(textNode);

				}

			},

			createUser: async function (e) {

				e.preventDefault();

				let ok = true;
				let message = '';
				let passwords = [];
				let formData = new FormData();

				for (let i = 0; i < document.forms[0].length - 1; i++) {

					if (document.forms[0].elements[i].value == '') {

						continue;

					} else {

						if (document.forms[0].elements[i].id == 'imageFile') {

							formData.append(document.forms[0].elements[i].id, document.forms[0].elements[i].files[0]);

						} else {

							formData.append(document.forms[0].elements[i].id, document.forms[0].elements[i].value);

						}

					}

					if (/password|user|email|name|surname/.test(document.forms[0].elements[i].id)) {

						document.forms[0].elements[i].value = document.forms[0].elements[i].value.substring(0, 250);

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

							} else {

								formData.append('users.password', passwords[1]);

							}

						}

					}

					if (/email/.test(document.forms[0].elements[i].id)) {

						if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.forms[0].elements[i].value))) {

							ok = false;
							message = 'Invalid email';
							break;

						}

					}

					if (/birthDate/.test(document.forms[0].elements[i].id)) {

						if (new Date() - new Date(document.forms[0].elements[i].value) <= 0) {

							ok = false;
							message = 'Invalid birthdate';
							break;

						}

					}

					if (/imageFile/.test(document.forms[0].elements[i].id)) {

						let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];
						let extension = document.forms[0].elements[i].files[0].name.split('.')[ document.forms[0].elements[i].files[0].name.split('.').length - 1];

						if (!validExtensions.includes(extension)) {

							ok = false;
							message = 'Invalid file extension';
							break;

						}

					}

				}

				if (ok) {

					let result = await Axios.post(`https://awesometracker.ddns.net/addUser`, formData);

					if (result.data.status == 'ok') {

						await Swal.fire({

							timer: 3000,
							title: 'Done',
							text: result.data.msg,
							icon: 'success'

						});

						this.$router.push('/login');

					} else {

						await Swal.fire({

							title: 'Some error',
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

	.user_img {

		width: 100%;
		height: 100%;

	}

</style>
