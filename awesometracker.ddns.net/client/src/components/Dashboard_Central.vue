<template>

	<div class="col-8 col-xl-10 m-0 p-0" id="central">

		<Navbar/>

		<div class="container-fluid">

			<router-view name='DashboardComponent'/>

		</div>

	</div>

</template>

<script>

	import Navbar from './Dashboard_Navbar.vue';

	export default {

		name: 'Central',
		components: {

			Navbar

		}

	}

</script>

<style>

	#central {

		height: 100vh;
		overflow: auto;

	}

</style>
