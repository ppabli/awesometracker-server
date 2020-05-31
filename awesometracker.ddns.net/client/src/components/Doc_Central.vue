<template>

	<div class="col-8 col-xl-10 m-0 p-0 position-relative" id="central">

		<Doc_Navbar/>

		<div class="container-fluid">

			<router-view name='DocComponent'/>

		</div>

	</div>

</template>

<script>

	import Doc_Navbar from './Doc_Navbar.vue'

	export default {

		name: 'API_Central',
		components: {

			Doc_Navbar

		}

	}

</script>

<style>

	#central {

		height: 100vh;
		overflow: auto;

	}

</style>