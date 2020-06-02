<template>

	<div>

		<Spinner v-if="ready == false"/>

		<div v-if="ready == true && posts.length != 0">

			<div class="row mt-3 justify-content-between align-items-center">

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-center align-items-center">

						Show
						<select v-model='type' class="mr-1 ml-1">

							<option value="0">All</option>
							<option v-for="category in categories" v-bind:key="category" v-bind:value="category['postCategories.code']">{{category['postCategories.name']}}</option>

						</select>
						posts

					</div>

				</div>

				<div class="col-12 col-md-6 col-xl-3">

					<div class="row mt-3 mt-md-0 justify-content-md-end justify-content-center">

						<div class="col-10">

							<div class="input-group">

								<div class="input-group-prepend">

									<div class="input-group-text">

										<i class="fas fa-search mr-2"></i>
										TITLE

									</div>

								</div>

								<input type="text" class="form-control" placeholder="Search..." v-model="filter">

							</div>

						</div>

					</div>

				</div>

			</div>

			<div class="row justify-content-center">

				<div class="col-12 col-md-6 col-xl-3 mt-3" v-for="post in posts.filter(post => type == 0 ? String(post['posts.title']).toLowerCase().match(filter.toLowerCase()) : String(post['posts.title']).toLowerCase().match(filter.toLowerCase()) && post['posts.categoryCode'] == type)" v-bind:key="post">

					<div class="card">

						<div class="card-header bg-dark text-light" v-if="post['posts.categoryCode'] == 1">

							<div class="row justify-content-between align-items-center">

								<h4 class="text-center">{{post['posts.title']}}</h4>

								<h5 class="text-center">{{$functions.parseDate(post['posts.registrationDate'], true)}}</h5>

							</div>

						</div>

						<div class="card-header bg-success" v-else-if="post['posts.categoryCode'] == 2">

							<div class="row justify-content-between align-items-center">

								<h5 class="text-center">{{post['posts.title']}}</h5>

								<h6 class="text-center">{{$functions.parseDate(post['posts.registrationDate'], true)}}</h6>

							</div>

						</div>

						<div class="card-header bg-warning" v-else-if="post['posts.categoryCode'] == 3">

							<div class="row justify-content-between align-items-center">

								<h5 class="text-center">{{post['posts.title']}}</h5>

								<h6 class="text-center">{{$functions.parseDate(post['posts.registrationDate'], true)}}</h6>

							</div>

						</div>

						<div class="card-header bg-info" v-else>

							<div class="row justify-content-between align-items-center">

								<h5 class="text-center">{{post['posts.title']}}</h5>

								<h6 class="text-center">{{$functions.parseDate(post['posts.registrationDate'], true)}}</h6>

							</div>

						</div>

						<div class="card-body">

							<p>{{post['posts.body'].split(' ').slice(0, 50).join(' ')}}...</p>

						</div>

						<div class="card-footer">

							<div class="row align-items-center">

								<p>Posted by: {{post['users.user']}}</p>

								<router-link class="btn btn-info ml-auto m-1" tag='button' :to="{path: `/dashboard/user/${post['posts.userCode']}`}">

									<i class="fas fa-user"></i>

								</router-link>

								<router-link class="btn btn-primary" tag='button' :to="{path: `/dashboard/posts/${post['posts.code']}`}">

									<i class="fas fa-newspaper"></i>

								</router-link>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

		<div v-else-if="ready == true">

			<div class="row">

				<div class="col-9">

					<div class="row m-3 align-items-center">

						<h2>0 posts</h2>

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

		name: 'Posts_Summary',
		components: {

			Spinner

		},
		data() {

			return {

				ready: false,
				posts: [],
				categories: [],
				filter: '',
				type: 0,

			}

		},
		async created() {

			this.ready = false;

			this.posts = [];

			let result = null;

			if (this.$parent.$parent.$parent.user['userCategories.name'] == 'ADMIN') {

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/8?orderBy=posts.code&order=desc`);

			} else {

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/8?where=posts.categoryCode!=1&orderBy=posts.code&order=desc`);

			}

			if (result.data.status == 'ok') {

				this.posts = result.data.data;

				this.categories = [];

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/15?orderBy=postCategories.code`);

				if (result.data.status == 'ok') {

					this.categories = result.data.data;

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

			this.ready = true;

		}

	}

</script>

<style>

</style>