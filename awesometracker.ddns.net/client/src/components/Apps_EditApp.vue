<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div class="row mt-3 justify-content-center" v-if="ready == true && app != null && ($parent.$parent.$parent.user['userCategories.name'] == 'ADMIN' || $parent.$parent.$parent.user['users.code'] == app['apps.userCode'])">

			<div class="col-12">

				<form @submit="updateApp">

					<div class="form-group">

						<label for="apps.name" class="sr-only">User</label>
						<input type="text" id="apps.name" class="form-control" placeholder="Name" :value="app['apps.name']" maxlength='250'>

					</div>

					<div class="form-group">

						<label for="apps.description" class="sr-only">User</label>
						<textarea class="form-control" id="apps.description" rows="5" cols="50" placeholder="Description" :value="app['apps.description']" maxlength='250'></textarea>

					</div>

					<div class="form-group">

						<div class="input-group">

							<label for="apps.token" class="sr-only">Token</label>
							<input type="text" id="apps.token" class="form-control rounded" placeholder="Token" :value="app['apps.token'].replace(/./g, '*')" required disabled>

							<div class="input-group-append">

								<button type="button" class="btn btn-danger" @click="generateToken"><i class="fas fa-redo"></i></button>
								<button type="button" class="btn btn-warning" @click="toggleToken"><i class="fas fa-eye"></i></button>
								<button type="button" class="btn btn-info" @click="copyToken"><i class="fas fa-copy"></i></button>

							</div>

						</div>

					</div>

					<div class="form-group">

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

					<div class="form-group">

						<div class="form-row">

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<h5 class="text-center">Actual image</h5>

								<div class="justify-content-center align-items-center">

									<img class="app_img" :src="app['apps.imageURL']">

								</div>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<h5 class="text-center">Future image</h5>

								<div id="uploadImgDiv" class="d-flex justify-content-center align-items-center">

									<img class="app_img" :src="app['apps.imageURL']">

								</div>

							</div>

						</div>

					</div>

					<div class="form-group" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN' || $parent.$parent.$parent.user['users.code'] == app['apps.userCode']">

						<div class="form-row" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN'">

							<div class="col-12 mb-3 col-md-3 mb-md-0">

								<label for="apps.categoryCode" class="sr-only">Category</label>
								<select id='apps.categoryCode' class="form-control" :value='app["apps.categoryCode"]' required>

									<option v-for='category in categories' :key="category" :value='category["appCategories.code"]'>{{category['appCategories.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-3 mb-md-0">

								<label for="apps.userCode" class="sr-only">App owner</label>
								<select id='apps.userCode' class="form-control" :value='app["apps.userCode"]' required>

									<option v-for='user in users' :key="user" :value='user["users.code"]'>{{user['users.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-3 mb-md-0">

								<label for="apps.statusCode" class="sr-only">App status</label>
								<select id='apps.statusCode' class="form-control" :value='app["apps.statusCode"]' required>

									<option v-for='stat in status' :key="stat" :value='stat["status.code"]'>{{stat['status.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-3 mb-md-0">

								<label for="apps.visibility" class="sr-only">App visibility</label>
								<select id='apps.visibility' class="form-control" :value='app["apps.visibility"]' required>

									<option value='public'>public</option>
									<option value='private'>private</option>

								</select>

							</div>

						</div>

						<div class="form-row" v-else>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="apps.statusCode" class="sr-only">App status</label>
								<select id='apps.statusCode' class="form-control" :value='app["apps.statusCode"]' required>

									<option v-for='stat in status' :key="stat" :value='stat["status.code"]'>{{stat['status.name']}}</option>

								</select>

							</div>

							<div class="col-12 mb-3 col-md-6 mb-md-0">

								<label for="apps.visibility" class="sr-only">App visibility</label>
								<select id='apps.visibility' class="form-control" :value='app["apps.visibility"]' required>

									<option value='public'>public</option>
									<option value='private'>private</option>

								</select>

							</div>

						</div>

					</div>

					<input type="hidden" id='apps.code' :value="app['apps.code']">
					<input type="hidden" id='originalUserCode' :value="app['apps.userCode']" v-if="$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN'">

					<button type="submit" class="btn btn-block btn-success mb-2">Update app</button>
					<button type="reset" class="btn btn-block btn-warning mb-2">Clear form</button>

				</form>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios'
	import Swal from 'sweetalert2'
	import Spinner from './Spinner.vue';

	export default {

		name: 'Apps_EditApp',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,
				app: null,
				selected: false,
				categories: [],
				users: [],
				status: [],
				newToken: null

			}

		},
		methods: {

			generateToken: async function (e) {

				e.preventDefault();

				let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/14`);
				let token = result.data.data;
				document.getElementById('apps.token').value = token;

				this.selected = true;
				this.newToken = token;

			},

			copyToken: function (e) {

				e.preventDefault();

				let copyElement = document.createElement('input');
				copyElement.value = this.newToken || this.app['apps.token'];
				copyElement.id = 'copy';

				document.body.appendChild(copyElement);

				let copyText = document.getElementById("copy");
				copyText.select();
				copyText.setSelectionRange(0, 99999);

				document.execCommand("copy");

				document.getElementById('copy').remove();

			},

			toggleToken: function (e) {

				e.preventDefault();

				if (this.selected) {

					document.getElementById('apps.token').value = document.getElementById('apps.token').value.replace(/./g, '*');

					this.selected = !this.selected;

				} else {

					document.getElementById('apps.token').value = this.newToken || this.app['apps.token'];

					this.selected = !this.selected;

				}

			},

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
						imgNode.classList.add('app_img');
						imgNode.src = this.app['apps.imageURL'];

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

			updateApp: async function (e) {

				e.preventDefault();

				let ok = true;
				let message = '';
				let formData = new FormData();

				for (let i = 0; i < document.forms[0].length - 1; i++) {

					if (document.forms[0].elements[i].value == '') {

						continue;

					} else {

						if (document.forms[0].elements[i].id == 'imageFile') {

							formData.append(document.forms[0].elements[i].id, document.forms[0].elements[i].files[0]);

						} else if (document.forms[0].elements[i].id == 'apps.token') {

							formData.append(document.forms[0].elements[i].id, this.newToken || this.app['apps.token']);

						} else {

							formData.append(document.forms[0].elements[i].id, document.forms[0].elements[i].value);

						}

					}

					if (/name|description/.test(document.forms[0].elements[i].id)) {

						document.forms[0].elements[i].value = document.forms[0].elements[i].value.substring(0, 250);

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

					let result = await Axios.post(`https://awesometracker.ddns.net/dashboard/updateApp`, formData);

					if (result.data.status == 'ok') {

						await Swal.fire({

							timer: 3000,
							title: 'Done',
							text: result.data.msg,
							icon: 'success'

						});

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

			this.app = null;

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/6?where=apps.code=${this.$route.params.appCode}`);

			if (result.data.status == 'ok') {

				if (result.data.data.length == 1) {

					this.app = result.data.data[0];

					if (this.$parent.$parent.$parent.user['userCategories.name'] != 'ADMIN' && this.$parent.$parent.$parent.user['users.code'] != this.app['apps.userCode']) {

						this.$router.go(-1);

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

			}

			this.status = [];

			result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/12?orderBy=status.code`);

			if (result.data.status == 'ok') {

				this.status = result.data.data;

			}

			if (this.$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN') {

				this.users = [];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/4?orderBy=users.code`);

				if (result.data.status == 'ok') {

					this.users = result.data.data;

				}

				this.categories = [];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/13?orderBy=appCategories.code`);

				if (result.data.status == 'ok') {

					this.categories = result.data.data;

				}

			}

			this.ready = true;

		}

	}

</script>

<style>

	.app_img {

		width: 100%;
		height: 100%;
		border-radius: 50%;

	}

</style>