<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div class="row mt-3 justify-content-center" v-if="ready == true && user != null && ($parent.$parent.$parent.user['users.code'] == user['users.code'] || $parent.$parent.$parent.user['userCategories.name'] == 'ADMIN' || apps.filter(app => app['apps.code'] == user['users.appCode']).length == 1)">

			<div class="col-12">

				<form @submit="updateUser" enctype="multipart/form-data">

					<div class="form-group">

						<label for="users.user" class="sr-only">User</label>
						<input type="text" id="users.user" class="form-control" placeholder="User" :value="user['users.user']" maxlength='250'>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="password1" class="sr-only">Password</label>
								<input type="password" id="password1" class="form-control" placeholder="Password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" maxlength='250'>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="password2" class="sr-only">Password confirm</label>
								<input type="password" id="password2" class="form-control" placeholder="Password (confirm)" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$" maxlength='250'>

							</div>

						</div>

						<small class="form-text text-muted text-center">Uppercase, lowercase, numbers, non alphanumeric characters and minimum 8 characters.</small>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-4 mb-md-0">

								<div class="input-group">

									<div class="input-group-prepend">

										<span class="input-group-text" id="inputGroupPrepend2">@</span>

									</div>

									<label for="users.email" class="sr-only">Email</label>
									<input type="email" id="users.email" class="form-control" placeholder="Email" :value="user['users.email']" maxlength='250'>

								</div>

							</div>

							<div class="col-12 mb-3 col-md-4 mb-md-0">

								<label for="users.visibility" class="sr-only">User visibility</label>
								<select id='users.visibility' class="form-control" :value='user["users.visibility"]' required>

									<option value='public'>public</option>
									<option value='private'>private</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-4 mb-md-0">

								<label for="users.diff" class="sr-only">User diff</label>
								<input type="number" id="users.diff" class="form-control" min="1" max="99999999999" :value='user["users.diff"]' required>

							</div>

						</div>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="users.name" class="sr-only">First name</label>
								<input type="text" id="users.name" class="form-control" placeholder="First name" :value="user['users.name']" maxlength='250'>

							</div>

							<div class="col-12 col-md-6 mb-md-0">

								<label for="users.surname" class="sr-only">Last name</label>
								<input type="text" id="users.surname" class="form-control" placeholder="Last name" :value="user['users.surname']" maxlength='250'>

							</div>

						</div>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="birthDate" class="sr-only">Birth date</label>
								<input type="date" min="1971-01-01" id="users.birthDate" class="form-control" placeholder="Birth date" :value="user['users.birthDate'].split('T')[0]">

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<div class="input-group">

									<div class="custom-file">

										<input type="file" class="custom-file-input" id="imageFile" @change="updateUploadImg">
										<label class="custom-file-label" for="imageFile">Choose file</label>

									</div>

									<div class="input-group-append">

										<button type="button" class="btn btn-danger" @click="clearFileInput"><i class="fas fa-trash"></i></button>

									</div>

								</div>

							</div>

						</div>

					</div>

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<h5 class="text-center">Actual image</h5>

								<div class="justify-content-center align-items-center">

									<img class="user_img" :src="user['users.imageURL']">

								</div>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<h5 class="text-center">Future image</h5>

								<div id="uploadImgDiv" class="d-flex justify-content-center align-items-center">

									<img class="user_img" :src="user['users.imageURL']">

								</div>

							</div>

						</div>

					</div>

					<div class="form-group" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN' || apps.filter(app => app['apps.code'] == user['users.appCode']).length == 1">

						<div class="form-row" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN'">

							<div class="col-12 mb-3 col-md-4 mb-md-0">

								<label for="users.categoryCode" class="sr-only">Category</label>
								<select id='users.categoryCode' class="form-control" :value='user["users.categoryCode"]' required>

									<option v-for='category in categories' :key="category" :value='category["userCategories.code"]'>{{category['userCategories.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-4 mb-md-0">

								<label for="users.appCode" class="sr-only">App owner</label>
								<select id='users.appCode' class="form-control" :value='user["users.appCode"]' required>

									<option v-for='app in apps' :key="app" :value='app["apps.code"]'>{{app['apps.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-4 mb-md-0">

								<label for="users.statusCode" class="sr-only">User status</label>
								<select id='users.statusCode' class="form-control" :value='user["users.statusCode"]' required>

									<option v-for='stat in status' :key="stat" :value='stat["status.code"]'>{{stat['status.name']}}</option>

								</select>

							</div>

						</div>

						<div class="form-row" v-else>

							<div class="col-12 col-md-6 mb-md-0">

								<label for="users.appCode" class="sr-only">App owner</label>
								<select id='users.appCode' class="form-control" :value='user["users.appCode"]' required>

									<option v-for='app in apps' :key="app" :value='app["apps.code"]'>{{app['apps.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="users.statusCode" class="sr-only">User status</label>
								<select id='users.statusCode' class="form-control" :value='user["users.statusCode"]' required>

									<option v-for='stat in status' :key="stat" :value='stat["status.code"]'>{{stat['status.name']}}</option>

								</select>

							</div>

						</div>

					</div>

					<input type="hidden" id='users.code' :value="user['users.code']">

					<button type="submit" class="btn btn-block btn-success mb-2">Update user</button>
					<button type="reset" class="btn btn-block btn-warning mb-2">Clear form</button>

				</form>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios';
	import Swal from 'sweetalert2';
	import Spinner from './Spinner.vue';

	export default {

		name: 'User_EditUser',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,
				user: null,
				categories: [],
				apps: [],
				status: [],

			}

		},
		methods: {

			clearFileInput: function (e) {

				e.preventDefault();

				document.getElementById('imageFile').value = '';
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
						imgNode.src = this.user['users.imageURL'];

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

			updateUser: async function (e) {

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

					if (/diff/.test(document.forms[0].elements[i].id)) {

						if (isNaN(document.forms[0].elements[i].value) || document.forms[0].elements[i].value <=0 || document.forms[0].elements[i].value > 99999999999) {

							ok = false;
							message = 'Invalid diff';
							break;

						}

					}

				}

				if (ok) {

					let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/updateUser`, formData);

					if (result.data.status == 'ok') {

						await Swal.fire({

							timer: 3000,
							title: 'Done',
							text: result.data.msg,
							icon: 'success'

						});

						result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/1?userCode=${this.$route.params.userCode}`);

						if (this.$parent.$parent.$parent.user['users.code'] == this.$route.params.userCode) {

							this.$parent.$parent.$parent.user = result.data.data[0];

						}

						this.$router.go(-1);

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

		},
		async created() {

			this.ready = false;

			this.user = null;
			this.apps = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/1?userCode=${this.$route.params.userCode}`);

			if (result.data.status == 'ok') {

				this.user = result.data.data[0];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/11?orderBy=apps.code`)

				if (result.data.status == 'ok') {

					this.apps = result.data.data;

					if (this.$parent.$parent.$parent.user['users.code'] != this.user['users.code'] && this.$parent.$parent.$parent.user['userCategories.name'] != 'ADMIN' && this.apps.filter(app => app['apps.code'] == this.user['users.appCode']).length != 1) {

						this.$router.go(-1);

					}

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

			this.status = [];

			result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/12?orderBy=status.code`);

			if (result.data.status == 'ok') {

				this.status = result.data.data;

			}

			if (this.$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN') {

				this.categories = [];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/9?orderBy=userCategories.code`);

				if (result.data.status == 'ok') {

					this.categories = result.data.data;

				}

				this.apps = [];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?orderBy=apps.code`);

				if (result.data.status == 'ok') {

					this.apps = result.data.data;

				}

			}

			this.ready = true;

		}

	}

</script>

<style>

	.user_img {

		width: 100%;
		height: 100%;

		border-radius: 50%;

	}

</style>