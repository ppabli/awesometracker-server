<template>

	<div class="col-12 col-xl-6 mt-3">

		<div class="card">

			<div class="card-header d-flex justify-content-between">

				<h4 class="card-title">{{title}}</h4>

				<button type="button" class="btn btn-tool" data-toggle="collapse" :data-target="`#card_body_${cardID}`" @click="toggleCard($event)"><i class="fas fa-angle-up"></i></button>

			</div>

			<div class="card-body collapse show" v-bind:id="`card_body_${cardID}`">

				<canvas v-bind:id="`chart_${cardID}`"></canvas>

			</div>

		</div>

	</div>

</template>

<script>

	export default {

		name: 'Card_Graph',
		props: [

			'title',
			'cardID',
			'chartID'

		],
		methods: {

			toggleCard(e) {

				e.preventDefault();

				if (e.target.tagName == 'BUTTON') {

					e.target.childNodes[0].classList.toggle("fa-angle-down");
					e.target.childNodes[0].classList.toggle("fa-angle-up");

				} else {

					e.target.classList.toggle("fa-angle-down");
					e.target.classList.toggle("fa-angle-up");

				}

			},

		}

	}

</script>

<style>

</style>