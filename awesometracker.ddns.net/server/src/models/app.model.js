class App {

	static checkToken(token) {

		return `select * from apps where token = '${token}'`;

	}

	static countCalls(appCode) {

		return `select count(*) from apiCalls where appCode = ${appCode} and DATEDIFF(current_timestamp, time) = 0`;

	}

	static getMaximumCallsBy(key, value) {

		return `select maximumCalls from appCategories where ${key} = ${value}`;

	}

	static getAppBy (params, filter = 'apps.code,apps.userCode,apps.token,apps.categoryCode,apps.name,apps.registrationDate,users.code,users.appCode,users.diff,users.user,users.password,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.birthDate,users.recoverURLCode,users.recoverCode,appCategories.code,appCategories.name,appCategories.description,appCategories.price,appCategories.maximumCalls', orderBy = null, order = 'asc') {

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

		query.push('from', 'apps', 'inner', 'join', 'users', 'on', 'apps.userCode', '=', 'users.code', 'inner', 'join', 'appCategories', 'on', 'apps.categoryCode', '=', 'appCategories.code');

		if (params) {

			enter = !enter;

			query.push('where');

			for (let param in params) {

				query.push(param, '=', `'${params[param]}'`, 'and');

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

}

module.exports = App; 