<template>

	<div class="col-12 col-md-4 col-xl-2 mt-3">

		<div class="card">

			<div class="card-body">

				<p>{{data}}</p>

			</div>

			<div class="card-footer">

				<p>{{title}}</p>

			</div>

		</div>

	</div>

</template>

<script>

	export default {

		name: 'Card',
		props: [

			'data',
			'title'

		]

	}

</script>

<style>

</style>