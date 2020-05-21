class Call {

	static getApiCallBy (params, filter = 'apiCalls.code,apiCalls.appCode,apiCalls.ipv4,apiCalls.url,apiCalls.method,apiCalls.registrationDate,apps.code,apps.userCode,apps.statusCode,apps.token,apps.categoryCode,apps.name,apps.description,apps.imageURL,apps.registrationDate,apps.lastUpdate', orderBy = null, order = 'asc') {

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

		query.push('from', 'apiCalls', 'inner', 'join', 'apps', 'on', 'apiCalls.appCode', '=', 'apps.code');

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

	static insertApiCall(appCode, ipv4, url, method) {

		return `insert into apiCalls values (0, '${appCode}', '${ipv4}', '${url}', '${method}', current_timestamp())`;

	}

	static insertAppCall(ipv4, url, method) {

		return `insert into appCalls values (0, '${ipv4}', '${url}', '${method}', current_timestamp())`;

	}

}

module.exports = Call;