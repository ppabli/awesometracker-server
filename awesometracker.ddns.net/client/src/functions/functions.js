export const FUNCTIONS = {

	randomColor: function () {

		return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

	},

	randomColorArray: function (length) {

		let colors = [];

		for (let i = 0; i < length; i++) {

			colors.push(this.randomColor());

		}

		return colors;

	},

	toggleMenu: function () {

		document.getElementById('central').classList.toggle("col-8");
		document.getElementById('central').classList.toggle("col-xl-10");

		document.getElementById('central').classList.toggle("col-12");

		document.getElementById('menu').classList.toggle("show");

	},

	parseHours(duration) {

		if (!duration) {

			return null;

		}

		let hours, minutes;

		hours = Math.floor(duration / 3600);

		duration -= hours * 3600;

		minutes = Math.floor(duration / 60);

		duration -= minutes * 60;

		return `${hours}h${minutes}m${duration}s`;

	},

	parseDate: function (date, day = false, hour = false) {

		if (!date) {

			return null;

		}

		let returnJSDate = new Date(date);

		if (!day && !hour) {

			return returnJSDate;

		} else if (day && !hour) {

			return `${returnJSDate.getFullYear()}-${returnJSDate.getMonth() + 1 < 10 ? '0' + (returnJSDate.getMonth() + 1): returnJSDate.getMonth() + 1}-${returnJSDate.getDate() < 10 ? '0' + returnJSDate.getDate(): returnJSDate.getDate()}`;

		} else {

			return `${returnJSDate.getFullYear()}-${returnJSDate.getMonth() + 1 < 10 ? '0' + (returnJSDate.getMonth() + 1): returnJSDate.getMonth() + 1}-${returnJSDate.getDate() < 10 ? '0' + returnJSDate.getDate(): returnJSDate.getDate()} | ${returnJSDate.getHours() < 10 ? '0' + returnJSDate.getHours(): returnJSDate.getHours()}:${returnJSDate.getMinutes() < 10 ? '0' + returnJSDate.getMinutes() :returnJSDate.getMinutes()}:${returnJSDate.getSeconds() < 10 ? '0' + returnJSDate.getSeconds():returnJSDate.getSeconds()}`;

		}

	},

	averageUsePerDay: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let data = this.usePerDay(logs);

		return Math.trunc(data.use.reduce((a, b) => {return a + b}, 0) / data.days.length);

	},

	averageUsePerApplication: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let data = this.usePerApplication(logs);

		return Math.trunc(data.use.reduce((a, b) => {return a + b}, 0) / data.applications.length);

	},

	averageUsePerCategory: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let data = this.usePerCategory(logs);

		return Math.trunc(data.use.reduce((a, b) => {return a + b}, 0) / data.categories.length);

	},

	averageUsePerUser(logs) {

		if (logs.length == 0) {

			return null;

		}

		let data = this.usePerUser(logs);

		return Math.trunc(data.use.reduce((a, b) => {return a + b}, 0) / data.users.length);

	},

	mostUsedCategory: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let data = this.usePerCategory(logs);

		let result = {category: '', use: Number.NEGATIVE_INFINITY}

		for (let i in data.categories) {

			if (data.use[i] > result.use) {

				result.category = data.categories[i];
				result.use = data.use[i]

			}

		}

		return result;

	},

	mostUsedApplication: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let data = this.usePerApplication(logs);

		let result = {application: '', use: Number.NEGATIVE_INFINITY}

		for (let i in data.applications) {

			if (data.use[i] > result.use) {

				result.application = data.applications[i];
				result.use = data.use[i]

			}

		}

		return result;

	},

	mostUsedApp: function (calls) {

		if (calls.length == 0) {

			return null;

		}

		let data = this.apiCallsPerApp(calls);

		let result = {app: '', calls: Number.NEGATIVE_INFINITY}

		for (let call in data.apps) {

			if (data.calls[call] > result.calls) {

				result.app = data.apps[call];
				result.calls = data.calls[call]

			}

		}

		return result;

	},

	usePerDay: function(logs) {

		if (logs.length == 0) {

			return null;

		}

		let days = [];
		let use = [];

		for (let log in logs) {

			let date = this.parseDate(logs[log]['trackerLogs.start'], true);

			if (!days.includes(date)) {

				if (days.length == 0) {

					days.push(date);
					use.push(logs[log]['trackerLogs.duration']);

				} else {

					for (let day in days) {

						if (days[day] > date) {

							days.splice(day, 0, date);
							use.splice(day, 0, logs[log]['trackerLogs.duration']);

							break;

						}

						if (day == days.length - 1) {

							days.push(date);
							use.push(logs[log]['trackerLogs.duration']);

							break;

						}

					}

				}

			} else {

				use[days.indexOf(date)] += logs[log]['trackerLogs.duration']

			}

		}

		return {days: days, use: use}

	},

	apiCallsPerDay(calls) {

		if (calls.length == 0) {

			return null;

		}

		let days = [];
		let finalCalls = [];

		for (let call in calls) {

			let date = this.parseDate(calls[call]['apiCalls.registrationDate'], true);

			if (!days.includes(date)) {

				days.push(date);
				finalCalls.push(1);

			} else {

				finalCalls[days.indexOf(date)]++

			}

		}

		return {days: days, calls: finalCalls}

	},

	apiCallsPerMonth(calls) {

		if (calls.length == 0) {

			return null;

		}

		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let finalCalls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let call in calls) {

			let date = new Date(calls[call]['apiCalls.registrationDate']).getMonth();

			finalCalls[date] += 1

		}

		return {months: months, calls: finalCalls}

	},

	usePerMonth(logs) {

		if (logs.length == 0) {

			return null;

		}

		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let use = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let log in logs) {

			let date = new Date(logs[log]['trackerLogs.start']).getMonth();

			use[date] += logs[log]['trackerLogs.duration'];

		}

		return {months: months, use: use}

	},

	usePerCategory: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let categories = [];
		let use = [];

		for (let log in logs) {

			if (!categories.includes(logs[log]['applications.category'])) {

				categories.push(logs[log]['applications.category']);
				use.push(logs[log]['trackerLogs.duration']);

			} else {

				use[categories.indexOf(logs[log]['applications.category'])] += logs[log]['trackerLogs.duration']

			}

		}

		return {categories: categories, use: use}

	},

	usePerApp: function (calls) {

		if (calls.length == 0) {

			return null;

		}

		let apps = [];
		let finalCalls = [];

		for (let call in calls) {

			if (!apps.includes(calls[call]['apps.name'])) {

				apps.push(calls[call]['apps.name']);
				finalCalls.push(1);

			} else {

				finalCalls[apps.indexOf(calls[call]['apps.name'])] += 1;

			}

		}

		return {apps: apps, calls: finalCalls}

	},

	usePerApplication: function (logs) {

		if (logs.length == 0) {

			return null;

		}

		let applications = [];
		let use = [];

		for (let log in logs) {

			if (!applications.includes(logs[log]['applications.app'])) {

				applications.push(logs[log]['applications.app']);
				use.push(logs[log]['trackerLogs.duration']);

			} else {

				use[applications.indexOf(logs[log]['applications.app'])] += logs[log]['trackerLogs.duration'];

			}

		}

		return {applications: applications, use: use}

	},

	usePerUser(logs) {

		if (logs.length == 0) {

			return null;

		}

		let users = [];
		let use = [];

		for (let log in logs) {

			if (!users.includes(logs[log]['users.code'])) {

				users.push(logs[log]['users.code']);
				use.push(logs[log]['trackerLogs.duration']);

			} else {

				use[users.indexOf(logs[log]['users.code'])] += logs[log]['trackerLogs.duration']

			}

		}

		return {users: users, use: use}

	},

	usersPerDay(users) {

		if (users.length == 0) {

			return null;

		}

		let days = [];
		let finalUsers = [];

		for (let user in users) {

			let date = this.parseDate(users[user]['users.registrationDate'], true);

			if (!days.includes(date)) {

				days.push(date);
				finalUsers.push(1);

			} else {

				finalUsers[days.indexOf(date)]++;

			}

		}

		return {days: days, users: finalUsers}

	},

	usersPerMonth(users) {

		if (users.length == 0) {

			return null;

		}

		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let finalUsers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let user in users) {

			let date = new Date(users[user]['users.registrationDate']).getMonth();

			finalUsers[date]++

		}

		return {months: months, users: finalUsers}

	},

	appsPerDay(apps) {

		if (apps.length == 0) {

			return null;

		}

		let days = [];
		let finalApps = [];

		for (let app in apps) {

			let date = this.parseDate(apps[app]['apps.registrationDate'], true);

			if (!days.includes(date)) {

				days.push(date);
				finalApps.push(1);

			} else {

				finalApps[days.indexOf(date)]++;

			}

		}

		return {days: days, apps: finalApps}

	},

	appsPerMonth(apps) {

		if (apps.length == 0) {

			return null;

		}

		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let finalApps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let app in apps) {

			let date = new Date(apps[app]['apps.registrationDate']).getMonth();

			finalApps[date]++

		}

		return {months: months, apps: finalApps}

	},

	applicationsPerDay(applications) {

		if (applications.length == 0) {

			return null;

		}

		let days = [];
		let finalApplications = [];

		for (let application in applications) {

			let date = this.parseDate(applications[application]['applications.registrationDate'], true);

			if (!days.includes(date)) {

				days.push(date);
				finalApplications.push(1);

			} else {

				finalApplications[days.indexOf(date)]++;

			}

		}

		return {days: days, applications: finalApplications}

	},

	applicationsPerMonth(applications) {

		if (applications.length == 0) {

			return null;

		}

		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let finalApplications = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let application in applications) {

			let date = new Date(applications[application]['applications.registrationDate']).getMonth();

			finalApplications[date]++

		}

		return {months: months, applications: finalApplications}

	},

	logsPerDay(logs) {

		if (logs.length == 0) {

			return null;

		}

		let days = [];
		let finalLogs = [];

		for (let log in logs) {

			let date = this.parseDate(logs[log]['trackerLogs.start'], true);

			if (!days.includes(date)) {

				days.push(date);
				finalLogs.push(1);

			} else {

				finalLogs[days.indexOf(date)]++

			}

		}

		return {days: days, logs: finalLogs}

	},

	logsPerMonth(logs) {

		if (logs.length == 0) {

			return null;

		}

		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let finalLogs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let log in logs) {

			let date = new Date(logs[log]['trackerLogs.start']).getMonth();

			finalLogs[date]++

		}

		return {months: months, logs: finalLogs}

	},

	todayUsers: function (users) {

		if (users.length == 0) {

			return 0;

		}

		let data = this.usersPerDay(users);

		let date = this.parseDate(new Date, true)

		if (data.days.includes(date)) {

			return data.users[data.days.indexOf(date)];

		} else {

			return 0;

		}

	},

	todayApps: function (apps) {

		if (apps.length == 0) {

			return 0;

		}

		let data = this.appsPerDay(apps);

		let date = this.parseDate(new Date, true)

		if (data.days.includes(date)) {

			return data.apps[data.days.indexOf(date)];

		} else {

			return 0;

		}

	},

	todayApplications: function (applications) {

		if (applications.length == 0) {

			return 0;

		}

		let data = this.applicationsPerDay(applications);

		let date = this.parseDate(new Date, true)

		if (data.days.includes(date)) {

			return data.applications[data.days.indexOf(date)];

		} else {

			return 0;

		}

	},

	todayLogs: function (logs) {

		if (logs.length == 0) {

			return 0;

		}

		let data = this.logsPerDay(logs);

		let date = this.parseDate(new Date, true)

		if (data.days.includes(date)) {

			return data.logs[data.days.indexOf(date)];

		} else {

			return 0;

		}

	},

	todayApiCalls: function (calls) {

		if (calls.length == 0) {

			return 0;

		}

		let data = this.apiCallsPerDay(calls);

		let date = this.parseDate(new Date, true)

		if (data.days.includes(date)) {

			return data.calls[data.days.indexOf(date)];

		} else {

			return 0;

		}

	},

	apiCallsPerApp: function (calls) {

		if (calls.length == 0) {

			return null;

		}

		let apps = [];
		let finalCalls = [];

		for (let call in calls) {

			if (!apps.includes(calls[call]['apps.name'])) {

				apps.push(calls[call]['apps.name']);
				finalCalls.push(1);

			} else {

				finalCalls[apps.indexOf(calls[call]['apps.name'])]++;

			}

		}

		return {apps: apps, calls: finalCalls}

	}

}