<template>

	<div class="bg-light collapse show col-4 col-xl-2 m-0 p-0 text-center" id="menu">

		<div class="sticky-top">

			<div class="list-group">

				<router-link to="/" class="bg-light list-group-item d-flex justify-content-center align-items-center border-0">

					<img id="logo" src="./../assets/icon.png" alt="awesomeTrackerLogo">

				</router-link>

				<router-link to="/docs" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

					<h6 class='mb-0'>Home</h6>

				</router-link>

				<div class="list-group p-0">

					<div class="row m-0 p-0">

						<div class="col-12 col-md-9 text-success p-0">

							<router-link to="/docs/api" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">API</router-link>

						</div>

						<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#collapse-0">

							<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down"></i></a>

						</div>

					</div>

				</div>

				<div class="list-group collapse" id="collapse-0">

					<div class="list-group p-0">

						<div class="row m-0 p-0">

							<div class="col-12 col-md-9 text-success p-0">

								<router-link to="/docs/api#introduction" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Intro</router-link>

							</div>

							<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#collapse-1">

								<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down"></i></a>

							</div>

						</div>

					</div>

					<div class="list-group collapse" id="collapse-1">

						<router-link to="/docs/api#api-doc" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Docs</router-link>
						<router-link to="/docs/api#api-version" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">API</router-link>
						<router-link to="/docs/api#start" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Start</router-link>
						<router-link to="/docs/api#recomendations" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Recomends</router-link>

					</div>

					<router-link to="/docs/api#resources" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

						<h6 class='mb-0'>Resources</h6>

					</router-link>

					<router-link to="/docs/api#authentication" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

						<h6 class='mb-0'>Auth</h6>

					</router-link>

					<router-link to="/docs/api#methods" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

						<h6 class='mb-0'>Methods</h6>

					</router-link>

					<div class="list-group p-0">

						<div class="row m-0 p-0">

							<div class="col-12 col-md-9 text-success p-0">

								<router-link to="/docs/api#request" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Request</router-link>

							</div>

							<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#collapse-2">

								<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down"></i></a>

							</div>

						</div>

					</div>

					<div class="list-group collapse" id="collapse-2">

						<router-link to="/docs/api#request-overview" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Overview</router-link>
						<router-link to="/docs/api#request-get" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">List</router-link>
						<router-link to="/docs/api#request-put" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Insert</router-link>
						<router-link to="/docs/api#request-patch" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Update</router-link>
						<router-link to="/docs/api#request-delete" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Delete</router-link>

					</div>

					<router-link to="/docs/api#quota" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

						<h6 class='mb-0'>Quota</h6>

					</router-link>

					<div class="list-group p-0">

						<div class="row m-0 p-0">

							<div class="col-12 col-md-9 text-success p-0">

								<router-link to="/docs/api#params" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Params</router-link>

							</div>

							<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#collapse-3">

								<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down"></i></a>

							</div>

						</div>

					</div>

					<div class="list-group collapse" id="collapse-3">

						<router-link to="/docs/api#params-overview" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Overview</router-link>
						<router-link to="/docs/api#params-summary" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Summary</router-link>
						<router-link to="/docs/api#params-filter" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Filter</router-link>
						<router-link to="/docs/api#params-where" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Where</router-link>
						<router-link to="/docs/api#params-orderBy" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">OrderBy</router-link>
						<router-link to="/docs/api#params-order" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Order</router-link>
						<router-link to="/docs/api#params-examples" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Examples</router-link>

					</div>

					<div class="list-group p-0">

						<div class="row m-0 p-0">

							<div class="col-12 col-md-9 text-success p-0">

								<router-link to="/docs/api#response" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Response</router-link>

							</div>

							<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#collapse-4">

								<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down"></i></a>

							</div>

						</div>

					</div>

					<div class="list-group collapse" id="collapse-4">

						<router-link to="/docs/api#response-overview" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Overview</router-link>
						<router-link to="/docs/api#response-examples" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Examples</router-link>

					</div>

					<div class="list-group p-0">

						<div class="row m-0 p-0">

							<div class="col-12 col-md-9 text-success p-0">

								<router-link to="/docs/api#errors" class="text-success list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Errors</router-link>

							</div>

							<div class="col-12 col-md-3 pr-4 pl-4 p-md-0" @click="toggle($event)" data-toggle="collapse" data-target="#collapse-5">

								<a href="" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0"><i class="fas fa-angle-down"></i></a>

							</div>

						</div>

					</div>

					<div class="list-group collapse" id="collapse-5">

						<router-link to="/docs/api#errors-overview" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Overview</router-link>
						<router-link to="/docs/api#errors-fields" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 h6 mb-0">Fields</router-link>

					</div>

				</div>

				<router-link to="/docs/terms" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

					<h6 class='mb-0'>Terms</h6>

				</router-link>
				
				<router-link to="/docs/privacy" class="list-group-item bg-light rounded-0 border-top border-right-0 border-left-0 border-bottom-0 text-success">

					<h6 class='mb-0'>Privacy</h6>

				</router-link>

			</div>

		</div>

	</div>

</template>

<script>

	export default {

		name: 'API_Menu',
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

			}

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
