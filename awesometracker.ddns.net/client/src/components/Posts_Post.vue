<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if="ready == true && post != null && (post['posts.categoryCode'] != 1 || (post['posts.categoryCode'] == 1 && $parent.$parent.$parent.user['userCategories.name'] == 'ADMIN'))">

			<div class="row p-0 m-0 mt-3 justify-content-around">

				<div class="col-12 rounded bg-light">

					<div class="row m-0 p-0 m-3 justify-content-between">

						<div class="col-12 col-md-3 col-xl-2 align-items-center justify-content-center">

							<div class="row align-items-center justify-content-center">

								<h2 class="text-center">Author</h2>

							</div>

							<div class="row border-top p-2 align-items-center justify-content-center">

								<img id="user_img" v-bind:src="post['users.imageURL']" alt="user_img">

							</div>

							<div class="row border-top align-items-center justify-content-center">

								<h3>{{post['users.user']}}</h3>

							</div>

						</div>

						<div class="col-12 col-md-8 align-items-center justify-content-center">

							<div class="row border-bottom align-items-center justify-content-center">

								<h2>{{post['posts.title']}}</h2>

							</div>

							<div class="row border-bottom align-items-center justify-content-center p-2">

								<h5>{{post['posts.body']}}</h5>

							</div>

							<div class="row align-items-center justify-content-around">

								<div class="col-6">

									<h6>Category: {{post['postCategories.name']}}</h6>

								</div>

								<div class="col-6">

									<h6>{{$functions.parseDate(post['posts.registrationDate'], true, true)}}</h6>

								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios'
	import Swal from 'sweetalert2'
	import Spinner from './Spinner.vue';

	export default {

		name: 'Posts_Post',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,
				post: null

			}

		},
		async beforeCreated() {

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/8?where=posts.code=${this.$route.params.postCode}`);

			if (result.data.status == 'ok') {

				this.post = result.data.data;

				if (this.post['posts.categoriesCode'] == 1 && this.$parent.$parent.$parent.user['userCategories.name'] != 'ADMIN') {

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

		},
		async created() {

			this.ready = false;

			this.post = null;

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/8?where=posts.code=${this.$route.params.postCode}`);

			if (result.data.status == 'ok') {

				this.post = result.data.data[0];

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

	#user_img {

		width: 100%;
		height: 100%;
		border-radius: 50%;

	}

</style>