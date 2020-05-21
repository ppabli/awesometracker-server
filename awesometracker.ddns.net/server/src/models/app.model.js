class App {

	constructor (userCode, name, description, imageURL = 'https://awesometracker.ddns.net/appImg/default.png', statusCode = 1, categoryCode = 7, visibility = 'public') {

		this.code = 0;
		this.userCode = userCode;
		this.statusCode = statusCode;
		this.visibility = visibility;
		this.token = PASSWORD.encryptPassword(String(new Date().getTime()));
		this.categoryCode = categoryCode
		this.name = name;
		this.description = description;
		this.registrationDate = "current_timestamp()";
		this.lastUpdate = "current_timestamp()";
		this.imageURL = imageURL;

	}

	insert () {

		return `insert into apps values (${this.code}, ${this.userCode}, ${this.statusCode}, '${this.visibility}', '${this.token}', ${this.categoryCode}, '${this.name}', '${this.description}', '${this.imageURL}', ${this.registrationDate}, ${this.lastUpdate})`;

	}

	static countCalls(appCode) {

		return `select count(*) from apiCalls where appCode = ${appCode} and DATEDIFF(current_timestamp, registrationDate) = 0`;

	}

	static getMaximumCallsBy(key, value) {

		return `select maximumCalls from appCategories where ${key} = ${value}`;

	}

	static getAppBy (params, filter = 'apps.code,apps.userCode,apps.statusCode,apps.visibility,apps.token,apps.categoryCode,apps.name,apps.description,apps.imageURL,apps.registrationDate,apps.lastUpdate,users.code,users.appCode,users.statusCode,users.diff,users.user,users.password,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.imageURL,users.recoverURLCode,users.recoverCode,appCategories.code,appCategories.name,appCategories.description,appCategories.price,appCategories.maximumCalls,status.code,status.name,status.description', orderBy = null, order = 'asc') {

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

		query.push('from', 'apps', 'inner', 'join', 'users', 'on', 'apps.userCode', '=', 'users.code', 'inner', 'join', 'appCategories', 'on', 'apps.categoryCode', '=', 'appCategories.code', 'inner', 'join', 'status', 'on', 'apps.statusCode', '=', 'status.code');

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

	static updateAppBy (params, fields) {

		let query = ['update', 'apps', 'set']

		let enter = false;

		if (fields) {

			enter = !enter

			for (let field in fields) {

				if (/password/.test(field)) {

					query.push(field, '=', `'${PASSWORD.encryptPassword(fields[field])}'`, ',');

				} else if (/lastUpdate/.test(field)) {

					query.push(field, '=', fields[field], ',');

				}else {

					query.push(field, '=', `'${fields[field]}'`, ',');

				}

			}

		}

		if (enter) {

			query.pop();
			enter = !enter;

		}

		if (params) {

			enter = !enter

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

	static deleteAppBy (params) {

		let query = ['delete', 'from', 'apps']

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

module.exports = App; 