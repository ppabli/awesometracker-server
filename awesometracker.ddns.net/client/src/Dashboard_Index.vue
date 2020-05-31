<template>

	<div class="row p-0 m-0 w-100" id="background">

		<Menu v-if="user != null && apps != null"/>
		<Central v-if="user != null && apps != null"/>

	</div>

</template>

<script>

	import Menu from './components/Dashboard_Menu.vue'
	import Central from './components/Dashboard_Central.vue'
	import Axios from 'axios'
	import Swal from 'sweetalert2'

	export default {

		name: 'Dashboard',
		components: {

			Menu,
			Central

		},
		data() {

			return {

				user: null,
				apps: null,

			}

		},
		async created() {

			this.user = null;

			let result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/0`);

			if (result.data.status == 'ok') {

				this.user = result.data.data.user

				result = await Axios.get(`https://awesometracker.ddns.net/dashboard/data/11`);

				if (result.data.status == 'ok') {

					this.apps = result.data.data

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
		mounted() {

			setTimeout(() => {

				if (window.innerWidth < 768) {

					this.$functions.toggleMenu();

				}

				window.addEventListener('resize', () => {

					if ((window.innerWidth < 768 && document.getElementById('menu').classList.contains('show')) || (window.innerWidth > 768 && !document.getElementById('menu').classList.contains('show'))) {

						this.$functions.toggleMenu();

					}

				});

			}, 500);

		}

	}

</script>

<style scoped>

	#background {

		min-height: 100vh;

	}

	html, body {

		overflow: hidden;

	}

</style>
