<template>

	<div class="bg-light collapse show col-4 col-xl-2 m-0 p-0 text-center" id="menu">

		<div class="sticky-top">

			<div class="list-group">

				<router-link to="/dashboard/" class="bg-light list-group-item d-flex justify-content-center align-items-center border-0">

					<img id="logo" src="./../assets/icon.png" alt="awesomeTrackerLogo">

				</router-link>

				<div class="list-group p-0">

					<div class="row m-0 p-0">

						<div class="col-12 col-md-9 text-success p-0">

							<router-link v-if="$parent.user != null" :to="{path: '/dashboard/user/' + $parent.user['users.code']}" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">

								{{$parent.user['users.user']}}

							</router-link>

						</div>

						<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#userMenu">

							<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down" id="userIcon"></i></a>

						</div>

					</div>

				</div>

				<div class="list-group collapse" id="userMenu">

					<router-link :to="{path: `/dashboard/user/${$parent.user['users.code']}`}" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">User</router-link>
					<a href='' class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0" @click="logout">Log out</a>

				</div>

				<div class="list-group p-0">

					<div class="row m-0 p-0">

						<div class="col-12 col-md-9 text-success p-0">

							<router-link :to="{path: '/dashboard/metrics/summary'}" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">

								Metrics

							</router-link>

						</div>

						<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#metricsMenu">

							<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down" id="metricsIcon"></i></a>

						</div>

					</div>

				</div>

				<div class="list-group collapse border-0" id="metricsMenu">

					<router-link to="/dashboard/metrics/summary" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Summary</router-link>
					<router-link to="/dashboard/metrics/logs" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Logs</router-link>
					<router-link to="/dashboard/metrics/applications" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Applic</router-link>

				</div>

				<div class="list-group p-0">

					<div class="row m-0 p-0">

						<div class="col-12 col-md-9 text-success p-0">

							<router-link :to="{path: '/dashboard/apps/summary'}" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">

								Apps

							</router-link>

						</div>

						<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#appsMenu">

							<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down" id="appsIcon"></i></a>

						</div>

					</div>

				</div>

				<div class="list-group collapse border-0" id="appsMenu">

					<router-link to="/dashboard/apps/summary" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Summary</router-link>
					<router-link to="/dashboard/apps/" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Apps</router-link>
					<router-link to="/dashboard/apps/users" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Users</router-link>
					<router-link to="/dashboard/apps/logs" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Logs</router-link>
					<router-link to="/dashboard/apps/applications" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Applic</router-link>

				</div>

				<router-link :to="{path: '/dashboard/downloads'}" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Down</router-link>
				<router-link :to="{path: '/dashboard/posts/summary'}" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">News</router-link>

				<div class="list-group p-0" v-if="$parent.user != null && $parent.user['userCategories.name'] == 'ADMIN'">

					<div class="row m-0 p-0">

						<div class="col-12 col-md-9 text-success p-0">

							<router-link :to="{path: '/dashboard/admin/users'}" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">

								Admin

							</router-link>

						</div>

						<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#adminMenu">

							<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down" id="adminIcon"></i></a>

						</div>

					</div>

				</div>

				<div class="list-group collapse border-0" id="adminMenu" v-if="$parent.user != null && $parent.user['userCategories.name'] == 'ADMIN'">

					<router-link to="/dashboard/admin/users" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Users</router-link>
					<router-link to="/dashboard/admin/logs" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Logs</router-link>
					<router-link to="/dashboard/admin/applications" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Applic</router-link>
					<router-link to="/dashboard/admin/apps" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Apps</router-link>

				</div>

			</div>

		</div>

	</div>

</template>

<script>

	import Swal from 'sweetalert2';
	import Axios from 'axios';

	export default {

		name: 'Menu',
		methods: {

			toggle(e) {

				e.preventDefault();

				if (e.target.tagName == 'A') {

					e.target.childNodes[0].classList.toggle("fa-angle-down");
					e.target.childNodes[0].classList.toggle("fa-angle-up");

				} else {

					e.target.classList.toggle("fa-angle-down");
					e.target.classList.toggle("fa-angle-up");

				}

			},

			logout: async function (e) {

				e.preventDefault();

				window.gapi.auth2.getAuthInstance().signOut();

				let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/logout`);

				if (result.data.status == 'ok') {

					this.$router.push('/');

				} else {

					await Swal.fire({

						showConfirmButton: false,
						timer: 5000,
						title: 'Invalid session | Logout',
						text: 'Redirecting',
						icon: 'warning'

					});

					this.$router.push('/login');

				}

			},

		},
		mounted() {

			window.gapi.load('auth2', function() {

				window.gapi.auth2.init({

					client_id: '79581400886-fld0pe7j7ohgqbkm8n75qimhikq6caoh.apps.googleusercontent.com',

				});

			});

		}

	}

</script>

<style scoped>

	#logo {

		width: 75%;
		height: 75%;

	}

	a {

		text-decoration: none;

	}

	#menu {

		height: 100vh;
		overflow: auto;

	}

</style>
