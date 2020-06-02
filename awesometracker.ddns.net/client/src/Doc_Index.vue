<template>

	<div class="row p-0 m-0 w-100" id="background">

		<Doc_Menu/>
		<Doc_Central/>

	</div>

</template>

<script>

	import Doc_Menu from './components/Doc_Menu.vue';
	import Doc_Central from './components/Doc_Central.vue';

	export default {

		name: 'Doc_Index',
		components: {

			Doc_Menu,
			Doc_Central

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