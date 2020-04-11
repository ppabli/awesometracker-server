class User {

	constructor (appCode, user, password, email, name, surname, birthDate) {

		this.code = 0;
		this.appCode = appCode;
		this.diff = 1
		this.user = user;
		this.password = PASSWORD.encryptPassword(password);
		this.email = email;
		this.categoryCode = 3
		this.name = name;
		this.surname = surname;
		this.registrationDate = "current_timestamp()";
		this.birthDate = birthDate;

	}

	insert () {

		return `insert into users values (${this.code}, '${this.appCode}', ${this.diff}, '${this.user}', '${this.password}', '${this.email}', ${this.categoryCode}, '${this.name}', '${this.surname}', ${this.registrationDate}, '${this.birthDate}', '', '')`;

	}

	static insertSessionLog(userCode, type, device) {

		return `insert into sessionLogs values (0, ${userCode}, current_timestamp(), '${type}', '${device}')`;

	}

	static checkUser (user, email, name, surname) {

		return `select * from users where user = '${user}' or email = '${email}' or name = '${name}' and surname = '${surname}'`;

	}

	static checkUserException (user, email, name, surname, code) {

		return `select * from users where (user = '${user}' and code != ${code}) or (email = '${email}' and code != ${code}) or (name = '${name}' and code != ${code}) or (surname = '${surname}' and code != ${code})`;

	}

	static getUserBy (params, filter = 'users.code,users.appCode,users.diff,users.user,users.password,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.recoverURLCode,users.recoverCode,apps.code,apps.userCode,apps.token,apps.categoryCode,apps.name,apps.registrationDate,apps.lastUpdate,userCategories.code,userCategories.name,userCategories.description,userCategories.price,userCategories.maximumApps', orderBy = null, order = 'asc') {

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

		query.push('from', 'users', 'inner', 'join', 'userCategories', 'on', 'users.categoryCode', '=', 'userCategories.code', 'inner', 'join', 'apps', 'on', 'users.appCode', '=', 'apps.code');

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

	static deleteUserBy (params) {

		let query = ['delete', 'from', 'users']

		let enter = false;

		if (params) {

			enter = !enter

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

	static updateUserBy (params, fields) {

		let query = ['update', 'users', 'set']

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

module.exports = User; 