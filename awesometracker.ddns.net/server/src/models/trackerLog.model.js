class TrackerLog {

	constructor (userCode, applicationCode, start, stop) {

		this.code = 0;
		this.userCode = userCode;
		this.applicationCode = applicationCode;
		this.start = start,
		this.stop = stop, 
		this.duration = `timestampdiff(SECOND, '${this.start}', '${this.stop}')`;

	}

	insert () {

		return `insert into trackerLogs values (${this.code}, ${this.userCode}, ${this.applicationCode}, '${this.start}', '${this.stop}', ${this.duration})`;

	}

	static getTrackerLogBy (params, filter = 'trackerLogs.code,trackerLogs.userCode,trackerLogs.applicationCode,trackerLogs.start,trackerLogs.stop,trackerLogs.duration,users.code,users.appCode,users.diff,users.user,users.password,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.recoverURLCode,users.recoverCode,applications.code,applications.userCode,applications.category,applications.app,applications.registrationDate,applications.lastUpdate', orderBy = null, order = 'asc') {

		let query = ['select'];

		let enter = false;

		let filters = filter.split(',');

		if (filters.length != 0) {

			enter = !enter;

			for (let i in filters) {

				query.push(filters[i], 'as', `"${filters[i]}"`, ',');

			}

		}

		if (enter) {

			enter = !enter;
			query.pop();

		}

		query.push('from', 'trackerLogs', 'inner', 'join', 'users', 'on', 'trackerLogs.userCode', '=', 'users.code', 'inner', 'join', 'applications', 'on', 'trackerLogs.applicationCode', '=', 'applications.code');

		if (params) {

			enter = !enter;

			query.push('where');

			let finalParams = params.split(',')

			for (let param in finalParams) {

				if (finalParams[param] == 'undefined') {

					continue;

				}

				query.push(finalParams[param], 'and');

			}

		}

		if (enter) {

			query.pop();

		}

		if (orderBy) {

			query.push('order', 'by', orderBy, order);

		}

		return query.join(' ');

	}

	static deleteTrackerLogBy (params) {

		let query = ['delete', 'from', 'trackerLogs']

		let enter = false;

		if (params) {

			enter = !enter;

			query.push('where');

			let finalParams = params.split(',')

			for (let param in finalParams) {

				if (finalParams[param] == 'undefined') {

					continue;

				}

				query.push(finalParams[param], 'and');

			}

		}

		if (enter) {

			query.pop();

		}

		return query.join(' ');

	}

}

module.exports = TrackerLog;