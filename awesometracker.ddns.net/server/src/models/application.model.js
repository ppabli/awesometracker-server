class Application {

	constructor (userCode, category, app) {

		this.code = 0;
		this.userCode = userCode;
		this.category = category,
		this.app = app
		this.registrationDate = "current_timestamp()";
		this.lastUpdate = "current_timestamp()";

	}

	insert() {

		return `insert into applications values (${this.code}, ${this.userCode}, '${this.category}', '${this.app}', ${this.registrationDate}, ${this.lastUpdate})`

	}

	static checkApplicationException (code, userCode, app) {

		return `select * from applications where userCode = ${userCode} and app = '${app}' and code != ${code}`;

	}

	static getApplicationBy (params, filter = 'applications.code,applications.userCode,applications.category,applications.app,applications.registrationDate,applications.lastUpdate,users.code,users.appCode,users.diff,users.user,users.password,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.imageURL,users.recoverURLCode,users.recoverCode', orderBy = null, order = 'asc') {

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

		query.push('from', 'applications', 'inner', 'join', 'users', 'on', 'applications.userCode', '=', 'users.code');

		if (params) {

			enter = !enter;

			query.push('where');

			let finalParams = params.split(',')

			for (let param in finalParams) {

				if (finalParams[param] == 'undefined' || param == '') {

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

	static updateApplicationBy (params, fields) {

		let query = ['update', 'applications', 'set']

		let enter = false;

		if (fields) {

			enter = !enter

			for (let field in fields) {

				if (/lastUpdate/.test(field)) {

					query.push(field, '=', fields[field], ',');

				} else {

					query.push(field, '=', `'${fields[field]}'`, ',');

				}

			}

		}

		if (enter) {

			query.pop();
			enter = !enter;

		}

		if (params) {

			enter = !enter;

			query.push('where');

			let finalParams = params.split(',')

			for (let param in finalParams) {

				if (finalParams[param] == 'undefined' || param == '') {

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

	static deleteApplicationBy (params) {

		let query = ['delete', 'from', 'applications']

		let enter = false;

		if (params) {

			enter = !enter;

			query.push('where');

			let finalParams = params.split(',')

			for (let param in finalParams) {

				if (finalParams[param] == 'undefined' || param == '') {

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

module.exports = Application; 