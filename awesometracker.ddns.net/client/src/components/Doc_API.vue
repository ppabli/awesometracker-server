<template>

	<div>

		<h3 id="introduction">Introduction</h3>

			<p>This document is intended for programmers who want to create applications that can interact with our data. Awesometracker and API basics are explained here. It also provides an overview of the different functions that the API supports performing for its users.</p>

			<p id="api-version">Currently API version <code>1.0</code>. | Last update 14/05/2020.</p>
			<p id="api-doc">API doc version <code>0.1</code> | Last update 14/05/2020.</p>

			<h4 id="start">Before start</h4>

				<p>You need a Awesometracker Account to access the Awesometracker web and register your app.</p>
				<p>To login into an existing account user the following link <a href="https://awesometracker.ddns.net/login">https://awesometracker.ddns.net/login</a>.</p>
				<p>To create an account access the following link to register in the system <a href="https://awesometracker.ddns.net/registry">https://awesometracker.ddns.net/registry</a>.</p>
				<p>Once you have the account created you can register the new application or edit an existing one from the side menu in the apps section.</p>

			<h4 id="recomendations">Recomendations</h4>

				<p>Familiarize yourself with the core concepts of the JSON (JavaScript Object Notation) data format. JSON is a common, language-independent data format that provides a simple text representation of arbitrary data structures.</p>
				<p>For more information, see <a href="https://www.json.org/json-en.html">https://www.json.org/json-en.html</a>.</p>

		<h3 id="resources">Resources and resource types</h3>

			<p>A resource is an individual data entity with a unique identifier. The table below describes the different types of resources that you can interact with using the API.</p>

			<Table v-bind:type="'resources'"/>

			<p>Note that, in many cases, a resource contains references to other resources.</p>

		<h3 id="authentication">Authentication</h3>

			<p>Your application must have authorization credential to be able to use the Awesometracker API. It also explains how to find or create authorization credential for your project.</p>
			<p>The authorization credential is a token that has to be provided in every request made to the API.</p>

			<h4>Create an app and get the token</h4>

				<p>Once the session started open apps page on the left side menu.</p>
				<p>In case you have an app already created, it should appear, just click on it and go to the page of the app itself where you can see its data, including the token.</p>
				<p>Otherwise, that is, in case you do not have any app created in the system, you must first create one by pressing the button with the cross and repeat the previous step.</p>

			<p>Once you already have a valid token, you only have to make a request to our API indicating the token in the header of the request. To do this, just use the following key value pair: <code>{token: 'token'}</code>.</p>
			<p>In some languages or libraries, this code may vary. To do so, check the documentation corresponding to the language or library that you use.</p>

		<h3 id="methods">Methods</h3>

			<h4>Supported operations</h4>

				<p>The following table shows the most common methods that the API supports.</p>

					<Table v-bind:type="'operations'"/>

					<p>The table below identifies the operations that are supported for different types of resources.</p>

					<Table v-bind:type="'supported_operations'"/>

		<h3 id="request">API requests</h3>

			<h4 id="request-overview">Overview</h4>

				<p>For clarity of presentation, the samples on this page show the distinctive elements of each request and abbreviate the base URL for the host that processes Data API requests (<code>https://awesometracker.ddns.net/api/v1</code>). To make the request outside of the context of the samples, you need to include the full URL.</p>
				<p>The following lists specifies the available routes as well as the optional and mandatory parameters required for their use.</p>
				<p>All content surrounded by {} refers to some type of request identifier. This reference can be of 2 mandatory type when it is represented as {testCode} or optional when it is accompanied by? like for example {testCode?}. The main objective of this parameter is to identify a specific resource from the entire list. By default and in all requests the parameter will be the code that identifies the resource. In some requests, this parameter will accept different values indicated in the request description itself.</p>

			<h4 id="request-get">List</h4>

				<ul>

					<li>

						<code>GET base-url/users/{code?}/</code>
						<p>This code can be user name, email or code.</p>

					</li>

					<li>

						<code>GET base-url/trackerLogs/{code?}/</code>

					</li>

					<li>

						<code>GET base-url/applications/{code?}/</code>

					</li>

					<li>

						<code>GET base-url/apps/{code?}/</code>

					</li>

					<li>

						<code>GET base-url/posts/{code?}/</code>

					</li>

					<li>

				<code>GET base-url/userCategories/{code?}/</code>

					</li>

					<li>

						<code>GET base-url/appCategories/{code?}/</code>

					</li>

					<li>

						<code>GET base-url/apiCalls/{code?}/</code>

					</li>

					<li>

						<code>GET base-url/status/{code?}/</code>

					</li>

				</ul>

				<p>Apart from the previous routes, the following routes allow you to obtain certain resources from certain users such as logs, apps or applications. Like all routes, they allow the use of identification codes to obtain specific resources.</p>

				<ul>

					<li>

						<code>GET base-url/users/{userCode}/trackerLogs/{logCode?}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>GET base-url/users/{userCode}/apps/{appCode?}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>GET base-url/users/{userCode}/applications/{applicationCode?}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>GET base-url/users/{userCode}/posts/{postCode?}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>GET base-url/users/{userCode}/apps/{appCode}/apiCalls/{apiCallCode?}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

				</ul>

			<h4 id="request-put">Insert</h4>

				<ul>

					<li>

						<code>POST base-url/users/</code>
						<p>For the correct user creation, the parameters that must be provided in the body of the request are the following ones indicated according to what they represent - key you should provide:</p>

							<ul>

								<li>

									<p>

										<code>user - users.user</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>password - users.password</code>

									</p>
									<p>Uppercase, lowercase, numbers, non alphanumeric characters and minimum 8 characters, maximun 250 characters</p>

								</li>

								<li>

									<p>

										<code>email - users.email</code>

									</p>
									<p>A valid email</p>

								</li>

								<li>

									<p>

										<code>name - users.name</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>surname - users.surname</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>birthdate - users.birthDate</code>

									</p>
									<p>A valid date of birth following the YYYY-MM-DD format can also provide the time in 24h HH:MM:SS format</p>

								</li>

								<li>

									<p>

										<code>image - users.imageURL</code>

									</p>
									<p>The url of the image accessible from the internet. In turn, the image must be in some of the following accepted formats: JPEG, JPG, PNG or GIF</p>
									<p>In case no url was provided, the following default value would be used: <code>https://awesometracker.ddns.net/userImg/default.png</code></p>

								</li>

								<li>

									<p>

										<code>status - users.statusCode</code>

									</p>
									<p>Determines the user status. It can be one of the following values: ACTIVATED (1), DESACTIVATED (2), BANNED (3) or PERMA-BANNED (4). The default value is activated. Use the code not the name to introduce this data</p>

								</li>

								<li>

									<p>

										<code>visibility - users.visibility</code>

									</p>
									<p>Determines the user visibility. This allows other users of the system to see their personal data such as email or age as well as the data associated with this user such as logs or applications. It can be one of the following values: public or private. The default value is public. Use the name to introduce this data.</p>

								</li>

							</ul>

					</li>

					<li>

						<code>POST base-url/users/{code}/apps/</code>
						<p>This code can be user name, email or code.</p>
						<p>For the correct app creation, the parameters that must be provided in the body of the request are the following ones indicated according to what they represent - key you should provide:</p>

						<ul>

							<li>

								<p>

									<code>name - apps.name</code>

								</p>
								<p>Maximum characters 250</p>

							</li>

							<li>

								<p>

									<code>description - apps.description</code>

								</p>
								<p>Maximum characters 250</p>

							</li>

							<li>

								<p>

									<code>image - apps.imageURL</code>

								</p>
								<p>The url of the image accessible from the internet. In turn, the image must be in some of the following accepted formats: JPEG, JPG, PNG or GIF,</p>
								<p>In case no url was provided, the following default value would be used: <code>https://awesometracker.ddns.net/userImg/default.png</code></p>

							</li>

							<li>

								<p>

									<code>status - apps.statusCode</code>

								</p>
								<p>Determines the app status. It can be one of the following values: ACTIVATED (1), DESACTIVATED (2), BANNED (3) or PERMA-BANNED (4). The default value is activated. Use the code not the name to introduce this data.</p>

							</li>

							<li>

								<p>

									<code>visibility - apps.visibility</code>

								</p>
								<p>Determines the app visibility. This allows other users of the system to see their data as well as the data associated with this ap such as logs or applications. It can be one of the following values: public or private. The default value is public. Use the name to introduce this data.</p>

							</li>

						</ul>

					</li>

					<li>

						<code>POST base-url/users/{code}/applications/</code>
						<p>This code can be user name, email or code.</p>
						<p>For the correct application creation, the parameters that must be provided in the body of the request are the following ones indicated according to what they represent - key you should provide:</p>

						<ul>

							<li>

								<p>

									<code>category - applications.category</code>

								</p>
								<p>This field determines which category the application belongs to. Maximum characters 250.</p>

							</li>

							<li>

								<p>

									<code>app - applications.app</code>

								</p>
								<p>Determine the name of the application. By default it is the name that the desktop application detects. Maximum characters 250. Note in case the name of the application does not match the name collected from the application, the system will register a new application with the name and unknown category.</p>

							</li>

						</ul>

					</li>

					<li>

						<code>POST base-url/users/{code}/trackerLogs/</code>
						<p>This code can be user name, email or code.</p>
						<p>For the correct log creation, the parameters that must be provided in the body of the request are the following ones indicated according to what they represent - key you should provide:</p>

						<ul>

							<li>

								<code>applicationCode - trackerLogs.applicationCode</code>
								<p>Identify the new log with an already existing application. In case the user does not have any application registered, the system will create a new application with the new data.</p>

							</li>

							<li>

								<code>start - trackerLogs.start</code>
								<p>Indicates the day and time the application started. It uses the format used in the other fields of the system date type, that is, it uses the YYYY-MM-DD format for the year and the HH: MM: SS format for the time.</p>

							</li>

							<li>

								<code>stop - trackerLogs.stop</code>
								<p>Indicates the day and time the application stopped. It uses the format used in the other fields of the system date type, that is, it uses the YYYY-MM-DD format for the year and the HH: MM: SS format for the time.</p>

							</li>

						</ul>

					</li>

				</ul>

			<h4 id="request-patch">Update</h4>

				<ul>

					<li>

						<code>PATCH base-url/users/{code}/</code>
						<p>This userCode can be user name, email or code.</p>
						<p>The fields available for updating are those marked in the following list as well as the possible values and limitations that these may have.</p>

							<ul>

								<li>

									<p>

										<code>user - users.user</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>password - users.password</code>

									</p>
									<p>Uppercase, lowercase, numbers, non alphanumeric characters and minimum 8 characters, maximun 250 characters.</p>

								</li>

								<li>

									<p>

										<code>email - users.email</code>

									</p>
									<p>A valid email</p>

								</li>

								<li>

									<p>

										<code>name - users.name</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>surname - users.surname</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>birthdate - users.birthDate</code>

									</p>
									<p>A valid date of birth following the YYYY-MM-DD format can also provide the time in 24h HH:MM:SS format</p>

								</li>

								<li>

									<p>

										<code>image - users.imageURL</code>

									</p>
									<p>The url of the image accessible from the internet. In turn, the image must be in some of the following accepted formats: JPEG, JPG, PNG or GIF.</p>
									<p>In case no url was provided, the following default value would be used: <code>https://awesometracker.ddns.net/userImg/default.png</code></p>

								</li>

								<li>

									<p>

										<code>status - users.statusCode</code>

									</p>
									<p>Determines the user status. It can be one of the following values: ACTIVATED (1), DESACTIVATED (2), BANNED (3) or PERMA-BANNED (4). The default value is activated. Use the code not the name to introduce this data.</p>

								</li>

								<li>

									<p>

										<code>visibility - users.visibility</code>

									</p>
									<p>Determines the user visibility. This allows other users of the system to see their personal data such as email or age as well as the data associated with this user such as logs or applications. It can be one of the following values: public or private. The default value is public. Use the name to introduce this data.</p>

								</li>

							</ul>

						</li>

					<li>

						<code>PATCH base-url/users/{userCode}/apps/{appCode}/</code>
						<p>This userCode can be user name, email or code.</p>

							<ul>

								<li>

									<p>

										<code>name - apps.name</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>description - apps.description</code>

									</p>
									<p>Maximum characters 250</p>

								</li>

								<li>

									<p>

										<code>image - apps.imageURL</code>

									</p>
									<p>The url of the image accessible from the internet. In turn, the image must be in some of the following accepted formats: JPEG, JPG, PNG or GIF.</p>
									<p>In case no url was provided, the following default value would be used: <code>https://awesometracker.ddns.net/userImg/default.png</code></p>

								</li>

								<li>

									<p>

										<code>status - apps.statusCode</code>

									</p>
									<p>Determines the app status. It can be one of the following values: ACTIVATED (1), DESACTIVATED (2), BANNED (3) or PERMA-BANNED (4). The default value is activated. Use the code not the name to introduce this data.</p>

								</li>

								<li>

									<p>

										<code>visibility - apps.visibility</code>

									</p>
									<p>Determines the app visibility. This allows other users of the system to see their data as well as the data associated with this ap such as logs or applications. It can be one of the following values: public or private. The default value is public. Use the name to introduce this data.</p>

								</li>

							</ul>

					</li>

					<li>

						<code>PATCH base-url/users/{userCode}/applications/{applicationCode}/</code>
						<p>This userCode can be user name, email or code.</p>

						<ul>

							<li>

								<p>

									<code>category - applications.category</code>

								</p>
								<p>This field determines which category the application belongs to. Maximum characters 250.</p>

							</li>

							<li>

								<p>

									<code>app - applications.app</code>

								</p>
								<p>Determine the name of the application. By default it is the name that the desktop application detects. Maximum characters 250. Note in case the name of the application does not match the name collected from the application, the system will register a new application with the name and unknown category. </p>

							</li>

						</ul>

					</li>

				</ul>

			<h4 id="request-delete">Delete</h4>

				<p>Note in case of deleting a user or application, all their data will be deleted, this includes logs, applications, apps and created users as well as your photos, API calls, session logs and other stored data. This action is recursive because all the data dependent on the deleted app or user will also be permanently removed from the system. This action is irreversible and is controlled by various filters to avoid unwanted actions.</p>

				<ul>

					<li>

						<code>DELETE base-url/users/{code}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>DELETE base-url/users/{userCode}/apps/{appCode}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>DELETE base-url/users/{userCode}/applications/{applicationCode}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

					<li>

						<code>DELETE base-url/users/{userCode}/trackerLogs/{logCode}/</code>
						<p>This userCode can be user name, email or code.</p>

					</li>

				</ul>

		<h3 id="quota">Quota usage</h3>

			<p>The Awesometracker API uses a quota to ensure that developers use the service as intended and do not create apps that unfairly reduce service quality or limit access for others. All API requests, including invalid requests, incur a quota cost.</p>

		<h3 id="params">Partial resources</h3>

			<h4 id="params-overview">Overview</h4>

				<p>The API allows the retrieval of partial resources so that apps avoid transferring, parsing, and storing unneeded data. This approach also ensures that the API uses network, CPU, and memory resources more efficiently.</p>

			<h4 id="params-summary">Params types</h4>

				<p>The API supports 4 request parameters only for the list operations, which are explained in the following sections, that enable you to identify the resource properties that should be included in API responses.</p>

				<ul>

					<li>The filter parameter filters the API response to only return specific properties within the requested resource parts.</li>
					<li>The where parameter filters the API response to only return resources that meet the requested conditions.</li>
					<li>The orderBy parameter filters the API response return specific resources ordered by the requested part.</li>
					<li>The order parameter specifies the order of the returned resources.</li>

				</ul>

			<h4 id="params-filter">How to use the filter parameter</h4>

				<p>The filter parameter filters the API response, which only contains the resource parts identified in the part parameter value, so that the response only includes a specific set of fields. The fields parameter lets you remove nested properties from an API response and thereby further reduce your bandwidth usage.</p>
				<p>Use a comma-separated list <code>filter=tableName.field,tableName2.field2</code> to select multiple fields.</p>

			<h4 id="params-where">How to use the where parameter</h4>

				<p>The filter parameter filt the API response, lets you remove unnecessary resources from an API response and thereby further reduce your bandwidth usage.</p>
				<p>Use a comma-separated list <code>where=tableName.field=value,tableName2.field2=value2</code> to select filter the resources.</p>

			<h4 id="params-orderBy">How to use the orderBy parameter</h4>

				<p>The orderBy parameter allow you to order the resources provided by the API response according to the value provided in the request in order to facilitate future treatment.</p>
				<p>Use a comma-separated list <code>orderBy=tableName.field,tableName2.field2</code> to select filter the resources.</p>

			<h4 id="params-order">How to use the order parameter</h4>

				<p>The order parameter lets you to indicate the type of ordering for the data you return in the response for it the parameter orderBy also has to be indicated otherwise no ordering will be performed.</p>
				<p>Use <code>order=asc</code> or <code>order=desc</code>. Only this two values are allowed.</p>

				<h4 id="params-examples">Request examples</h4>

					<div class="card text-center m-0 p-0">

						<div class="card-header">

							<ul class="nav nav-tabs card-header-tabs">

								<li class="nav-item">

									<a class="nav-link active" href="#example_1" data-toggle='tab' data-target='#example_1'>Example 1</a>

								</li>

								<li class="nav-item">

									<a class="nav-link" href="#example_2" data-toggle='tab' data-target='#example_2'>Example 2</a>

								</li>

								<li class="nav-item">

									<a class="nav-link" href="#example_3" data-toggle='tab' data-target='#example_3'>Example 3</a>

								</li>

								<li class="nav-item">

									<a class="nav-link" href="#example_4" data-toggle='tab' data-target='#example_4'>Example 4</a>

								</li>

								<li class="nav-item">

									<a class="nav-link" href="#example_5" data-toggle='tab' data-target='#example_5'>Example 5</a>

								</li>

							</ul>

						</div>

						<div class="card-body text-left">

							<div class="tab-content">

								<div class="tab-pane collapse active" id="example_1">

									<div class="card-text">

										<h5>URL: <code>https://awesometracker.ddns.net/api/v1/users</code></h5>
										<h5>Description: user list.</h5>
										<h5>API response:</h5>
										<pre>

											<code>

	{
		"status": "ok",
		"data": [
			{
				"users.code": 1,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "awesometracker",
				"users.email": "awesometracker",
				"users.categoryCode": 1,
				"users.name": "awesometracker",
				"users.surname": "awesometracker",
				"users.registrationDate": "2020-01-22T14:55:55.000Z",
				"users.lastUpdate": "2020-04-09T14:58:12.000Z",
				"users.birthDate": "2020-01-03T10:39:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/default.png",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z",
				"userCategories.code": 1,
				"userCategories.name": "ADMIN",
				"userCategories.description": "Super Admin",
				"userCategories.price": 1000000000,
				"userCategories.maximumApps": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			},
			{
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z",
				"userCategories.code": 1,
				"userCategories.name": "ADMIN",
				"userCategories.description": "Super Admin",
				"userCategories.price": 1000000000,
				"userCategories.maximumApps": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			},
			{
				"users.code": 135,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "Diego Martínez de Santiago",
				"users.email": "a18diegomd@iessanclemente.net",
				"users.categoryCode": 2,
				"users.name": "Diego",
				"users.surname": "Martínez de Santiago",
				"users.registrationDate": "2020-05-10T17:34:48.000Z",
				"users.lastUpdate": "2020-05-11T14:52:13.000Z",
				"users.birthDate": "1970-12-30T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/135_1d96fb247245d165ea1bc0665e2017b1",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z",
				"userCategories.code": 2,
				"userCategories.name": "ALMOST ADMIN",
				"userCategories.description": "Almost ADMIN account",
				"userCategories.price": 200,
				"userCategories.maximumApps": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			}
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

											</code>

										</pre>

									</div>

								</div>

								<div class="tab-pane collapse" id="example_2">

									<div class="card-text">

										<h5>URL: <code>https://awesometracker.ddns.net/api/v1/users?filter=users.code</code></h5>
										<h5>Description: user list using some filter parameter.</h5>
										<h5>API response:</h5>
										<pre>

											<code>

	{
		"status": "ok",
		"data": [
			{
				"users.code": 1
			},
			{
				"users.code": 57
			},
			{
				"users.code": 135
			}
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

											</code>

										</pre>

									</div>

								</div>

								<div class="tab-pane collapse" id="example_3">

									<div class="card-text">

										<h5>URL: <code>https://awesometracker.ddns.net/api/v1/users?filter=users.code&where=users.appCode=1&</code></h5>
										<h5>Description: user list using filter and where parameters.</h5>
										<h5>API response:</h5>
										<pre>

											<code>

	{
		"status": "ok",
		"data": [
			{
				"users.code": 1
			}
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

											</code>

										</pre>

									</div>

								</div>

								<div class="tab-pane collapse" id="example_4">

									<div class="card-text">

										<h5>URL: <code>https://awesometracker.ddns.net/api/v1/users?filter=users.code&where=users.appCode=1&orderBy=users.code</code></h5>
										<h5>Description: user list using filter, where and orderBy parameters.</h5>
										<h5>API response:</h5>
										<pre>

											<code>

	{
		"status": "ok",
		"data": [
			{
				"users.code": 1
			},
			{
				"users.code": 57
			},
			{
				"users.code": 135
			}
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

											</code>

										</pre>

									</div>

								</div>

								<div class="tab-pane collapse" id="example_5">

									<div class="card-text">

										<h5>URL: <code>https://awesometracker.ddns.net/api/v1/users?filter=users.code&where=users.appCode=1&orderBy=users.code&order=desc</code></h5>
										<h5>Description: user list using filter, where, orderBy and order parameters.</h5>
										<h5>API response:</h5>
										<pre>

											<code>

	{
		"status": "ok",
		"data": [
			{
				"users.code": 135
			},
			{
				"users.code": 57
			},
			{
				"users.code": 1
			}
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

											</code>

										</pre>

									</div>

								</div>

							</div>

						</div>

					</div>

		<h3 id="response">Response</h3>

			<h4 id="response-overview">Overview</h4>

				<p>Every list request to the API return returns a specific set of data on which the aforementioned parameters are applied. These data vary depending on the resource that is being requested. The fields returned in a request are shown below without any type of filter.</p>

			<h4 id="response-examples">Response examples</h4>

				<div class="card text-center m-0 p-0">

					<div class="card-header">

						<ul class="nav nav-tabs card-header-tabs">

							<li class="nav-item">

								<a class="nav-link active" href="#user" data-toggle='tab' data-target='#user'>User</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#app1" data-toggle='tab' data-target='#app1'>App</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#log" data-toggle='tab' data-target='#log'>Log</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#application" data-toggle='tab' data-target='#application'>Applications</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#post" data-toggle='tab' data-target='#post'>Post</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#status" data-toggle='tab' data-target='#status'>Status</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#userCategory" data-toggle='tab' data-target='#userCategory'>User category</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#appCategory" data-toggle='tab' data-target='#appCategory'>App category</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#postCategory" data-toggle='tab' data-target='#postCategory'>Post category</a>

							</li>

							<li class="nav-item">

								<a class="nav-link" href="#apiCall" data-toggle='tab' data-target='#apiCall'>API call</a>

							</li>

						</ul>

					</div>

					<div class="card-body text-left">

						<div class="tab-content">

							<div class="tab-pane collapse active" id="user">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/users</code></h5>
									<h5>Description: User list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"users.code": 1,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "awesometracker",
				"users.email": "awesometracker",
				"users.categoryCode": 1,
				"users.name": "awesometracker",
				"users.surname": "awesometracker",
				"users.registrationDate": "2020-01-22T14:55:55.000Z",
				"users.lastUpdate": "2020-04-09T14:58:12.000Z",
				"users.birthDate": "2020-01-03T10:39:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/default.png",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z",
				"userCategories.code": 1,
				"userCategories.name": "ADMIN",
				"userCategories.description": "Super Admin",
				"userCategories.price": 1000000000,
				"userCategories.maximumApps": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			},
			{
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z",
				"userCategories.code": 1,
				"userCategories.name": "ADMIN",
				"userCategories.description": "Super Admin",
				"userCategories.price": 1000000000,
				"userCategories.maximumApps": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="app1">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/apps</code></h5>
									<h5>Description: App list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

		"status": "ok",
		"data": [
			{
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z",
				"users.code": 1,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "awesometracker",
				"users.email": "awesometracker",
				"users.categoryCode": 1,
				"users.name": "awesometracker",
				"users.surname": "awesometracker",
				"users.registrationDate": "2020-01-22T14:55:55.000Z",
				"users.lastUpdate": "2020-04-09T14:58:12.000Z",
				"users.birthDate": "2020-01-03T10:39:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/default.png",
				"appCategories.code": 1,
				"appCategories.name": "ADMIN",
				"appCategories.description": "Super Admin",
				"appCategories.price": 1000000000,
				"appCategories.maximumCalls": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			},
			{
				"apps.code": 20,
				"apps.userCode": 57,
				"apps.statusCode": 1,
				"apps.categoryCode": 7,
				"apps.name": "Esto no es una prueba",
				"apps.description": "Peude que si que sea una prueba\n",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/20_e09cfc6b392f5497b50fab44f57a86c8.jpg",
				"apps.registrationDate": "2020-05-11T10:10:36.000Z",
				"apps.lastUpdate": "2020-05-11T10:10:36.000Z",
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"appCategories.code": 7,
				"appCategories.name": "STANDARD",
				"appCategories.description": "Standard account",
				"appCategories.price": 0,
				"appCategories.maximumCalls": 0,
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			}
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="log">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/trackerLogs</code></h5>
									<h5>Description: Log (trackerLogs) list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"trackerLogs.code": 28,
				"trackerLogs.userCode": 57,
				"trackerLogs.applicationCode": 1,
				"trackerLogs.start": "2020-04-03T15:37:51.000Z",
				"trackerLogs.stop": "2020-04-03T15:37:58.000Z",
				"trackerLogs.duration": 6,
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"applications.code": 1,
				"applications.userCode": 57,
				"applications.category": "Development",
				"applications.app": "AwesomeTracker",
				"applications.registrationDate": "2020-04-03T16:37:27.000Z",
				"applications.lastUpdate": "2020-04-09T14:59:14.000Z"
			},
			{
				"trackerLogs.code": 30,
				"trackerLogs.userCode": 57,
				"trackerLogs.applicationCode": 1,
				"trackerLogs.start": "2020-04-03T15:39:35.000Z",
				"trackerLogs.stop": "2020-04-03T15:39:36.000Z",
				"trackerLogs.duration": 1,
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"applications.code": 1,
				"applications.userCode": 57,
				"applications.category": "Development",
				"applications.app": "AwesomeTracker",
				"applications.registrationDate": "2020-04-03T16:37:27.000Z",
				"applications.lastUpdate": "2020-04-09T14:59:14.000Z"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="application">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/applications</code></h5>
									<h5>Description: Application list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"applications.code": 1,
				"applications.userCode": 57,
				"applications.category": "Development",
				"applications.app": "AwesomeTracker",
				"applications.registrationDate": "2020-04-03T16:37:27.000Z",
				"applications.lastUpdate": "2020-04-09T14:59:14.000Z",
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg"
			},
			{
				"applications.code": 2,
				"applications.userCode": 57,
				"applications.category": "General",
				"applications.app": "Google Chrome",
				"applications.registrationDate": "2020-04-03T16:37:27.000Z",
				"applications.lastUpdate": "2020-04-09T14:59:14.000Z",
				"users.code": 57,
				"users.appCode": 1,
				"users.statusCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.lastUpdate": "2020-05-02T09:44:10.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="post">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/posts</code></h5>
									<h5>Description: Post list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"posts.code": 1,
				"posts.userCode": 57,
				"posts.title": "Pruebas 1",
				"posts.body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum tempore vel necessitatibus quibusdam culpa hic ad soluta accusantium iusto laborum doloribus fuga voluptatem dicta rem quisquam, placeat quos! Saepe, harum.\r\nSit alias quo facere quos non sint est veritatis officia, velit ad rem voluptatem repudiandae in. A omnis voluptates cupiditate, eaque molestiae impedit repellat illum, labore maxime rerum ratione optio!\r\nItaque aliquid iste harum alias maiores quis eveniet a enim error qui voluptatum culpa, eius odio consequatur, perspiciatis libero eaque commodi autem accusamus quisquam ipsum aliquam, ratione tempora assumenda. Laboriosam.\r\nUt adipisci voluptate dignissimos, libero eius inventore numquam explicabo? Cum quos debitis rerum corrupti delectus accusamus in labore molestiae saepe ea vel qui ratione, velit officia recusandae. Numquam, natus adipisci.\r\nLaboriosam itaque quas libero non soluta nam impedit consequatur a aliquam, maxime iusto unde asperiores recusandae exercitationem ullam et debitis consequuntur doloremque quis eos. Quisquam, modi! Eligendi libero magni perspiciatis.\r\n",
				"posts.registrationDate": "2020-04-07T10:06:37.000Z",
				"posts.categoryCode": 2,
				"users.code": 57,
				"users.appCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.password": "$2a$10$qkLMxDvLbE7ywRH4Li.4q.WrKF7rLLvyMEG6EkjG7cLNMMVWPf7cS",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"users.recoverURLCode": "",
				"users.recoverCode": "",
				"postCategories.code": 2,
				"postCategories.name": "UPDATE",
				"postCategories.description": "New general posts"
			},
			{
				"posts.code": 2,
				"posts.userCode": 57,
				"posts.title": "Pruebas 2",
				"posts.body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum tempore vel necessitatibus quibusdam culpa hic ad soluta accusantium iusto laborum doloribus fuga voluptatem dicta rem quisquam, placeat quos! Saepe, harum.\r\nSit alias quo facere quos non sint est veritatis officia, velit ad rem voluptatem repudiandae in. A omnis voluptates cupiditate, eaque molestiae impedit repellat illum, labore maxime rerum ratione optio!\r\nItaque aliquid iste harum alias maiores quis eveniet a enim error qui voluptatum culpa, eius odio consequatur, perspiciatis libero eaque commodi autem accusamus quisquam ipsum aliquam, ratione tempora assumenda. Laboriosam.\r\nUt adipisci voluptate dignissimos, libero eius inventore numquam explicabo? Cum quos debitis rerum corrupti delectus accusamus in labore molestiae saepe ea vel qui ratione, velit officia recusandae. Numquam, natus adipisci.\r\nLaboriosam itaque quas libero non soluta nam impedit consequatur a aliquam, maxime iusto unde asperiores recusandae exercitationem ullam et debitis consequuntur doloremque quis eos. Quisquam, modi! Eligendi libero magni perspiciatis.\r\n",
				"posts.registrationDate": "2020-05-06T14:36:26.000Z",
				"posts.categoryCode": 3,
				"users.code": 57,
				"users.appCode": 1,
				"users.diff": 1,
				"users.user": "ppabli",
				"users.password": "$2a$10$qkLMxDvLbE7ywRH4Li.4q.WrKF7rLLvyMEG6EkjG7cLNMMVWPf7cS",
				"users.email": "ppabli@outlook.com",
				"users.categoryCode": 1,
				"users.name": "Ramon",
				"users.surname": "Ramirez",
				"users.registrationDate": "2020-03-31T17:58:05.000Z",
				"users.birthDate": "1999-01-14T23:00:00.000Z",
				"users.imageURL": "https://awesometracker.ddns.net/userImg/57_f7e990d26440581e66d619f12b740f49.jpg",
				"users.recoverURLCode": "",
				"users.recoverCode": "",
				"postCategories.code": 3,
				"postCategories.name": "IMPORTANT",
				"postCategories.description": "IMPOSTANT posts"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="status">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/status</code></h5>
									<h5>Description: Status list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"status.code": 1,
				"status.name": "ACTIVATED",
				"status.description": "Full operational status"
			},
			{
				"status.code": 2,
				"status.name": "DESACTIVATED",
				"status.description": "Access disabled"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="userCategory">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/userCategories</code></h5>
									<h5>Description: User category list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"userCategories.code": 1,
				"userCategories.name": "ADMIN",
				"userCategories.description": "Super Admin",
				"userCategories.price": 1000000000,
				"userCategories.maximumApps": 0
			},
			{
				"userCategories.code": 2,
				"userCategories.name": "ALMOST ADMIN",
				"userCategories.description": "Almost ADMIN account",
				"userCategories.price": 200,
				"userCategories.maximumApps": 0
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="appCategory">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/appCategories</code></h5>
									<h5>Description: App category list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"appCategories.code": 1,
				"appCategories.name": "ADMIN",
				"appCategories.description": "Super Admin",
				"appCategories.price": 1000000000,
				"appCategories.maximumCalls": 0
			},
			{
				"appCategories.code": 2,
				"appCategories.name": "ALMOST ADMIN",
				"appCategories.description": "Almost ADMIN account",
				"appCategories.price": 200,
				"appCategories.maximumCalls": 0
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="postCategory">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/postCategories</code></h5>
									<h5>Description: Post category list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"postCategories.code": 1,
				"postCategories.name": "ADMIN",
				"postCategories.description": "Only admin posts"
			},
			{
				"postCategories.code": 2,
				"postCategories.name": "UPDATE",
				"postCategories.description": "New general posts"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

							<div class="tab-pane collapse" id="apiCall">

								<div class="card-text">

									<h5>URL: <code>https://awesometracker.ddns.net/api/v1/apiCalls</code></h5>
									<h5>Description: API Call list.</h5>
									<h5>API response:</h5>
									<pre>

										<code>

	{
		"status": "ok",
		"data": [
			{
				"apiCalls.code": 1,
				"apiCalls.appCode": 1,
				"apiCalls.url": "/applications?orderBy=users.email",
				"apiCalls.method": "GET",
				"apiCalls.registrationDate": "2020-04-02T14:33:21.000Z",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z"
			},
			{
				"apiCalls.code": 2,
				"apiCalls.appCode": 1,
				"apiCalls.url": "/applications?orderBy=applications.code",
				"apiCalls.method": "GET",
				"apiCalls.registrationDate": "2020-05-02T14:33:22.000Z",
				"apps.code": 1,
				"apps.userCode": 1,
				"apps.statusCode": 1,
				"apps.categoryCode": 1,
				"apps.name": "awesometracker",
				"apps.description": "asd",
				"apps.imageURL": "https://awesometracker.ddns.net/appImg/default.png",
				"apps.registrationDate": "2020-04-03T16:37:46.000Z",
				"apps.lastUpdate": "2020-04-09T14:58:55.000Z"
			},
			...
		],
		"msg": "",
		"doc": "https://awesometracker.ddns.net/docs"
	}

										</code>

									</pre>

								</div>

							</div>

						</div>

					</div>

				</div>

		<h3 id="errors">Errors</h3>

			<h4 id="errors-overview">Overview</h4>

				<p>Our API incorporates an error control system. This system allows that when any request is not made correctly it is on the part of the user as on our part the affected parties will be notified. For this, all the answers issued include the following fields.</p>

			<h4 id="errors-fields">Error info</h4>

				<ul>

					<li>

						<h5>Status (status)</h5>
						<p>The status field in the response indicate whether the request was successful or not. The values are ok and error.</p>
						<p>Note. In case the request is not incorrect or an error occurs during its execution, an error will be emited in status field. However, in case this does not happen, the answer will be ok, even though no resource is provided.</p>

					</li>

					<li>

						<h5>Message (msg)</h5>
						<p>It is an informational message of the error that occurred. In case an error does not occur, the message will be empty.</p>

					</li>

					<li>

						<h5>Documentation (doc)</h5>
						<p>It is a link to the API documentation.</p>

					</li>

				</ul>

	</div>

</template>

<script>

	import Table from './Table.vue'

	export default {

		name: 'API_Central',
		components: {

			Table

		}

	}

</script>

<style>

	#central {

		height: 100vh;
		overflow: auto;

		position: relative;

	}

</style>