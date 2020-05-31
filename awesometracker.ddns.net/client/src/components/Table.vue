<template>

	<div class="col-12 col-xl-6 table-responsive">

		<table class="table table-hover">

			<caption v-if="title && title != ''">{{title}}</caption>

			<thead v-if="type == 'logs'">

				<tr>

					<th>Code</th>
					<th>User code</th>
					<th>User name</th>
					<th>User email</th>
					<th>Application code</th>
					<th>Application</th>
					<th>Category</th>
					<th>Start</th>
					<th>Stop</th>
					<th>Duration</th>
					<th v-if="!$route.params.userCode">User</th>

				</tr>

			</thead>

			<thead v-if="type == 'users'">

				<tr>

					<th>Code</th>
					<th>User</th>
					<th>Email</th>
					<th>Category</th>
					<th>Name</th>
					<th>Surname</th>
					<th>Registration date</th>
					<th>Birthdate</th>
					<th>User</th>

				</tr>

			</thead>

			<thead v-if="type == 'applications'">

				<tr>

					<th>Code</th>
					<th>User code</th>
					<th>User name</th>
					<th>User email</th>
					<th>Category</th>
					<th>App</th>
					<th>Registration date</th>

				</tr>

			</thead>

			<thead v-if="type == 'apps'">

				<tr>

					<th>Code</th>
					<th>Name</th>
					<th>User code</th>
					<th>User name</th>
					<th>User email</th>
					<th>Status</th>
					<th>Category</th>
					<th>Registration date</th>
					<th>Last update</th>
					<th>App</th>

				</tr>

			</thead>

			<thead v-if="type == 'apiCalls'">

				<tr>

					<th>Code</th>
					<th>App code</th>
					<th>App name</th>
					<th>Method</th>
					<th>Registration date</th>
					<th v-if="!$route.params.appCode">App</th>

				</tr>

			</thead>

			<thead v-if="type == 'logs_months'">

				<tr>

					<th>Month</th>
					<th>Logs count</th>
					<th>% of total</th>

				</tr>

			</thead>

			<thead v-if="type == 'apps_months'">

				<tr>

					<th>Month</th>
					<th>Apps count</th>
					<th>% of total</th>

				</tr>

			</thead>

			<thead v-if="type == 'applications_months'">

				<tr>

					<th>Month</th>
					<th>Applications count</th>
					<th>% of total</th>

				</tr>

			</thead>

			<thead v-if="type == 'apiCalls_months'">

				<tr>

					<th>Month</th>
					<th>API calls count</th>
					<th>% of total</th>

				</tr>

			</thead>

			<thead v-if="type == 'resources'">

				<tr>

					<th>Resource</th>
					<th>Description</th>

				</tr>

			</thead>

			<thead v-if="type == 'operations'">

				<tr>

					<th>Operation</th>
					<th>Description</th>

				</tr>

			</thead>

			<thead v-if="type == 'supported_operations'">

				<tr>

					<th>Resource</th>
					<th>List</th>
					<th>Insert</th>
					<th>Update</th>
					<th>Delete</th>

				</tr>

			</thead>

			<tbody v-if="type == 'logs'">

				<tr v-for='(log, index) in direction == "reverse" ? data.slice(0).reverse().slice(0, rows) : data.slice(0, rows)' v-bind:key="index">

					<td>{{log['trackerLogs.code']}}</td>
					<td>{{log['users.code']}}</td>
					<td>{{log['users.user']}}</td>
					<td>{{log['users.email']}}</td>
					<td>{{log['applications.code']}}</td>
					<td>{{log['applications.app']}}</td>
					<td>{{log['applications.category']}}</td>
					<td>{{$functions.parseDate(log['trackerLogs.start'], true, true)}}</td>
					<td>{{$functions.parseDate(log['trackerLogs.stop'], true, true)}}</td>
					<td>{{log['trackerLogs.duration']}}</td>
					<td v-if="!$route.params.userCode"><button class="btn btn-info" @click="seeUser(log)"><i class="fas fa-user"></i></button></td>

				</tr>

			</tbody>

			<tbody v-if="type == 'users'">

				<tr v-for='(user, index) in direction == "reverse" ? data.slice(0).reverse().slice(0, rows) : data.slice(0, rows)' v-bind:key="index">

					<td>{{user['users.code']}}</td>
					<td>{{user['users.user']}}</td>
					<td>{{user['users.email']}}</td>
					<td>{{user['userCategories.name']}}</td>
					<td>{{user['users.name']}}</td>
					<td>{{user['users.surname']}}</td>
					<td>{{$functions.parseDate(user['users.registrationDate'], true, true)}}</td>
					<td>{{$functions.parseDate(user['users.birthDate'], true, true)}}</td>
					<td><button class="btn btn-info" @click="seeUser(user)"><i class="fas fa-user"></i></button></td>

				</tr>

			</tbody>

			<tbody v-if="type == 'applications'">

				<tr v-for='(application, index) in direction == "reverse" ? data.slice(0).reverse().slice(0, rows) : data.slice(0, rows)' v-bind:key="index">

					<td>{{application['applications.code']}}</td>
					<td>{{application['users.code']}}</td>
					<td>{{application['users.user']}}</td>
					<td>{{application['users.email']}}</td>
					<td>{{application['applications.category']}}</td>
					<td>{{application['applications.app']}}</td>
					<td>{{$functions.parseDate(application['applications.registrationDate'], true, true)}}</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'apps'">

				<tr v-for='(app, index) in direction == "reverse" ? data.slice(0).reverse().slice(0, rows) : data.slice(0, rows)' v-bind:key="index">

					<td>{{app['apps.code']}}</td>
					<td>{{app['apps.name']}}</td>
					<td>{{app['apps.userCode']}}</td>
					<td>{{app['users.user']}}</td>
					<td>{{app['users.email']}}</td>
					<td>{{app['status.name']}}</td>
					<td>{{app['appCategories.name']}}</td>
					<td>{{$functions.parseDate(app['apps.registrationDate'], true, true)}}</td>
					<td>{{$functions.parseDate(app['apps.lastUpdate'], true, true)}}</td>
					<td><button class="btn btn-info" @click="seeApp(app)"><i class="fas fa-atom"></i></button></td>

				</tr>

			</tbody>

			<tbody v-if="type == 'apiCalls'">

				<tr v-for='(call, index) in direction == "reverse" ? data.slice(0).reverse().slice(0, rows) : data.slice(0, rows)' v-bind:key="index">

					<td>{{call['apiCalls.code']}}</td>
					<td>{{call['apiCalls.appCode']}}</td>
					<td>{{call['apps.name']}}</td>
					<td>{{call['apiCalls.method']}}</td>
					<td>{{$functions.parseDate(call['apiCalls.registrationDate'], true, true)}}</td>
					<td v-if="!$route.params.appCode"><button class="btn btn-info" @click="seeAppCode(call['apps.code'])"><i class="fas fa-atom"></i></button></td>

				</tr>

			</tbody>

			<tbody v-if="type == 'logs_months'">

				<tr v-for='(month, index) in data.months' v-bind:key="index">

					<td>{{month}}</td>
					<td>{{data.logs[index]}}</td>
					<td>{{Math.round(data.logs[index] / data.logs.reduce((a, b) => {return a + b}, 0) * 100)}}%</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'apps_months'">

				<tr v-for='(month, index) in data.months' v-bind:key="index">

					<td>{{month}}</td>
					<td>{{data.apps[index]}}</td>
					<td>{{Math.round(data.apps[index] / data.apps.reduce((a, b) => {return a + b}, 0) * 100)}}%</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'applications_months'">

				<tr v-for='(month, index) in data.months' v-bind:key="index">

					<td>{{month}}</td>
					<td>{{data.applications[index]}}</td>
					<td>{{Math.round(data.applications[index] / data.applications.reduce((a, b) => {return a + b}, 0) * 100)}}%</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'apiCalls_months'">

				<tr v-for='(month, index) in data.months' v-bind:key="index">

					<td>{{month}}</td>
					<td>{{data.calls[index]}}</td>
					<td>{{Math.round(data.calls[index] / data.calls.reduce((a, b) => {return a + b}, 0) * 100)}}%</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'resources'">

				<tr>

					<td>User</td>
					<td>Contains information about a user</td>

				</tr>

				<tr>

					<td>App</td>
					<td>Contains information about an app</td>

				</tr>

				<tr>

					<td>Log (trackerLog)</td>
					<td>Contains information about a log</td>

				</tr>

				<tr>

					<td>Application</td>
					<td>Contains information about an application</td>

				</tr>

				<tr>

					<td>Post</td>
					<td>Contains information about a post</td>

				</tr>

				<tr>

					<td>Status</td>
					<td>Contains information about a user or app status</td>

				</tr>

				<tr>

					<td>User category</td>
					<td>Contains information about an user category</td>

				</tr>

				<tr>

					<td>App category</td>
					<td>Contains information about an app category</td>

				</tr>

				<tr>

					<td>Post category</td>
					<td>Contains information about an post category</td>

				</tr>

				<tr>

					<td>API call</td>
					<td>Contains information about an API call</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'operations'">

				<tr>

					<td>List</td>
					<td>Retrieves (GET) a list of zero or more resources.</td>

				</tr>

				<tr>

					<td>Insert</td>
					<td>Creates (POST) a new resource.</td>

				</tr>

				<tr>

					<td>Update</td>
					<td>Modifies (PATCH) an existing resource to reflect data in your request.</td>

				</tr>

				<tr>

					<td>Delete</td>
					<td>Removes (DELETE) a specific resource.</td>

				</tr>

			</tbody>

			<tbody v-if="type == 'supported_operations'">

				<tr>

					<td>User</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>

				</tr>

				<tr>

					<td>App</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>

				</tr>

				<tr>

					<td>Log (trackerLog)</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-check text-success"></i></td>

				</tr>

				<tr>

					<td>Application</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-check text-success"></i></td>

				</tr>

				<tr>

					<td>Post</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>

				</tr>

				<tr>

					<td>Status</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>

				</tr>

				<tr>

					<td>User categories</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>

				</tr>

				<tr>

					<td>App categories</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>

				</tr>

				<tr>

					<td>Post categories</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>

				</tr>

				<tr>

					<td>API calls</td>
					<td><i class="fas fa-check text-success"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>
					<td><i class="fas fa-times text-danger"></i></td>

				</tr>

			</tbody>

		</table>

	</div>
</template>

<script>

	export default {

		name: 'Table',
		props: [

			'data',
			'title',
			'type',
			'rows',
			'direction'

		],
		methods: {

			seeUser: function (log) {

				this.$router.push(`/dashboard/user/${log['users.code']}`);

			},

			seeUserCode: function (code) {

				this.$router.push(`/dashboard/user/${code}`);

			},

			seeApp: function (app) {

				this.$router.push(`/dashboard/apps/${app['apps.code']}`);

			},

			seeAppCode: function (code) {

				this.$router.push(`/dashboard/apps/${code}`);

			},

		}

	}

</script>

<style>

</style>