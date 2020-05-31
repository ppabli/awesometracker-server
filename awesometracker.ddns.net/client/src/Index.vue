<template>

	<div id="background" class="d-flex flex-column justify-content-center align-items-center" v-if="ready == true">

		<div class="container bg-white rounded p-5">

			<div class="row justify-content-center">

				<img id="logo" src="./assets/icon.png" alt="awesomeTrackerLogo">

			</div>

			<div class="row justify-content-center text-center">

				<h1>AwesomeTracker</h1>

			</div>

			<div class="row justify-content-center text-center">

				<h5>The best way to track your day</h5>

			</div>

			<div class="row justify-content-center">

				<router-link class="m-2 disabled" to="/login">

					<button type="button" class="btn btn-lg btn-info"><i class="fas fa-info m-2"></i>Login</button>

				</router-link>

				<router-link class="m-2 disabled" to="/docs">

					<button type="button" class="btn btn-lg btn-success"><i class="far fa-file-alt m-2"></i>Docs</button>

				</router-link>

				<a href="https://github.com/ppabli" target="_blank" class="btn btn-lg btn-dark m-2"><i class="fab fa-github m-2"></i>Github</a>

			</div>

			<hr>

			<div class="row justify-content-center" v-if="posts.length != 0">

				<div class="col mt-2">

					<div class="row justify-content-center">

						<h3>News</h3>

					</div>

					<div class="row justify-content-center" v-for="(post, index) in posts.slice(0, 3)" v-bind:key="post">

						<p v-if="index % 2 == 0">

							<span class="badge badge-success" v-if="post['posts.categoryCode'] == 2">{{post['postCategories.name']}}</span>
							<span class="badge badge-warning" v-else-if="post['posts.categoryCode'] == 3">{{post['postCategories.name']}}</span>
							<span class="badge badge-info" v-else>{{post['postCategories.name']}}</span>

							{{post['posts.title']}}

						</p>

						<p v-else>

							{{post['posts.title']}}

							<span class="badge badge-success" v-if="post['posts.categoryCode'] == 2">{{post['postCategories.name']}}</span>
							<span class="badge badge-success" v-else-if="post['posts.categoryCode'] == 3">{{post['postCategories.name']}}</span>
							<span class="badge badge-success" v-else>{{post['postCategories.name']}}</span>

						</p>

					</div>

					<div class="row justify-content-center">

						<h5>Login to see all complete news</h5>

					</div>

				</div>

			</div>

			<hr>

			<div class="row justify-content-center">

				<div class="col mt-4">

					<div class="row justify-content-center">

						<i class="fas fa-database fa-5x"></i>

					</div>

					<div class="row justify-content-center mt-2 text-center">

						<p>Powerfull API interaction</p>

					</div>

				</div>

				<div class="col mt-4">

					<div class="row justify-content-center">

						<i class="fab fa-osi fa-5x"></i>

					</div>

					<div class="row justify-content-center mt-2 text-center">

						<p>Open source base</p>

					</div>

				</div>

				<div class="col mt-4">

					<div class="row justify-content-center">

						<i class="fas fa-chart-pie fa-5x"></i>

					</div>

					<div class="row justify-content-center mt-2 text-center">

						<p>Awesome charts</p>

					</div>

				</div>

			</div>

			<hr>

			<div class="row justify-content-center text-center">

				<p>

					Developed by
					<a href="https://github.com/ppabli" target="_blank"> Pablo Liste Cancela </a>
					<i class="far fa-copyright"></i>

				</p>

			</div>

		</div>

	</div>

</template>

<script>

	import Axios from 'axios'

	export default {

		name: 'Index',
		data() {

			return {

				ready: false,
				posts: []

			}

		},
		async created() {

			this.ready = false;

			this.posts = [];

			let result = await Axios.get(`https://awesometracker.ddns.net/posts`);

			if (result.data.status == 'ok') {

				this.posts = result.data.data;

			}

			this.ready = true;

		}

	}

</script>

<style scoped>

	#background {

		min-height: 100vh;
		background-image: linear-gradient(#84e8e8, #9BFF00);

	}

	#logo {

		width: 50%;
		height: 50%;
		max-width: 420px;
		max-height: 420px;

	}

</style>
