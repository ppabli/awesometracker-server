redirect = (req, res, next) => {

	if(!req.secure) {

		res.redirect('https://' + req.headers.host + req.url);

	} else {

		next();

	}

}

escapeHTML = async (req, res, next) => {

	for (header in req.headers) {

		req.headers[header] = FUNCTIONS.escapeHTML(req.headers[header]);

	}

	for (param in req.params) {

		req.params[param] = FUNCTIONS.escapeHTML(req.params[param]);

	}

	for (i in req.body) {

		req.body[i] = FUNCTIONS.escapeHTML(req.body[i]);

	}

	next();

}

checkToken = async (req, res, next) => {

	try {

		if (req.headers.token) {

			let result = await QUERY(APP.getAppBy(`apps.token='${req.headers.token}'`));

			if (result.length != 0) {

				res.locals.application = result[0];
				next();

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'The provided token is not correct'});

			}

		} else {

		res.status(200).json({status: 'error', data: [], msg: 'No token has been provided'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: e});

	}

};

checkCalls = async (req, res, next) => {

	try {

		let result = await QUERY(APP.countCalls(res.locals.application['apps.code']));

		if (result.length != 0) {

			let calls = result[0]['count(*)'];

			result = await QUERY(APP.getMaximumCallsBy('code', res.locals.application['apps.categoryCode']));

			if (result.length != 0) {

				let maximumCalls = result[0]['maximumCalls'];

				if (maximumCalls == 0 || calls < maximumCalls) {

					QUERY(CALL.insertApiCall(res.locals.application['apps.code'], /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.exec(req.ip)[0], req.url, req.method));
					next();

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'The maximum number of requests has been exceeded'})

				}

			}

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: e});

	}

};

checkApp = async (req, res, next) => {

	try {

		let result = await QUERY(USER.getUserBy(`users.code=${req.params.userCode}`));

		if (result.length == 1) {

			let user = result[0];

			result = await QUERY(APP.getAppBy(`apps.userCode=${req.params.userCode}`));

			let apps = result;

			if (user['userCategories.maximumApps'] == 0) {

				next();

			} else {

				if (user['userCategories.maximumApps'] > apps.length) {

					next();

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Maximum apps reached'});

				}

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Invalid user provided'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: e});

	}

}

checkStatus = async (req, res, next) => {

	try {

		if (res.locals.application['apps.statusCode'] == 1) {

			if (req.params.userCode) {

				let result = await QUERY(USER.getUserBy(`users.code=${req.params.userCode}`));

				user = result[0];

				if (user['users.statusCode'] == 1) {

					next()

				} else {

					res.status(200).json({status: 'error', data: [], msg: `Invalid app status | App status: ${user['status.name']} | Status description: ${user['status.description']}`})

				}

			} else {

				next();

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: `Invalid app status | App status: ${res.locals.application['status.name']} | Status description: ${res.locals.application['status.description']}`})

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: e});

	}

}

filter = (req, res, next) => {

	try {

		if (res.locals.application['apps.token'] == CONFIG.API_TOKEN) {

			next();

		} else {

			let routeParts = req.route.path.split('/');
			let route = `${routeParts[routeParts.length - 2]}/${routeParts[routeParts.length - 1]}`;

			let wheres = req.query.where ? req.query.where.split(',') : [];

			delete wheres['users.password'];
			delete wheres['users.recoverURLCode'];
			delete wheres['users.recoverLCode'];
			delete wheres['apps.token'];
			delete wheres['apiCalls.ipv4'];

			if (/posts/.test(route)) {

				wheres.push('posts.categoryCode!=1');

			}

			if (wheres.length == 0) {

				delete req.query.where;

			} else {

				req.query.where = wheres.join(',');

			}

			let filters = req.query.filter ? req.query.filter.split(',') : null;

			for (filter in filters) {

				if (/password/.test(filters[filter].toLowerCase()) || /recover/.test(filters[filter].toLowerCase()) || /token/.test(filters[filter].toLowerCase()) || /ipv4/.test(filters[filter].toLowerCase())) {

					filters.splice(filter, 1);

				}

			}

			if (filters && filters.length != 0) {

				req.query.filter = filters.join(',')

			} else {

				if (/trackerLogs/.test(route)) {

					req.query.filter = 'trackerLogs.code,trackerLogs.userCode,trackerLogs.applicationCode,trackerLogs.start,trackerLogs.stop,trackerLogs.duration,users.code,users.appCode,users.statusCode,users.diff,users.user,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.imageURL,applications.code,applications.userCode,applications.category,applications.app,applications.registrationDate,applications.lastUpdate';

				} else if (/applications/.test(route)) {

					req.query.filter = 'applications.code,applications.userCode,applications.category,applications.app,applications.registrationDate,applications.lastUpdate,users.code,users.appCode,users.statusCode,users.diff,users.user,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.imageURL';

				} else if (/users/.test(route)) {

					req.query.filter = 'users.code,users.appCode,users.statusCode,users.diff,users.user,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.imageURL,apps.code,apps.userCode,apps.statusCode,apps.categoryCode,apps.name,apps.description,apps.imageURL,apps.registrationDate,apps.lastUpdate,userCategories.code,userCategories.name,userCategories.description,userCategories.price,userCategories.maximumApps,status.code,status.name,status.description';

				} else if (/apps/.test(route)) {

					req.query.filter = 'apps.code,apps.userCode,apps.statusCode,apps.categoryCode,apps.name,apps.description,apps.imageURL,apps.registrationDate,apps.lastUpdate,users.code,users.appCode,users.statusCode,users.diff,users.user,users.email,users.categoryCode,users.name,users.surname,users.registrationDate,users.lastUpdate,users.birthDate,users.imageURL,appCategories.code,appCategories.name,appCategories.description,appCategories.price,appCategories.maximumCalls,status.code,status.name,status.description';

				} else if (/apiCalls/.test(route)) {

					req.query.filter = 'apiCalls.code,apiCalls.appCode,apiCalls.url,apiCalls.method,apiCalls.registrationDate,apps.code,apps.userCode,apps.statusCode,apps.categoryCode,apps.name,apps.description,apps.imageURL,apps.registrationDate,apps.lastUpdate';

				}

			}

			next();

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: 'General error'});

	}

}

checkPermits = async (req, res, next) => {

	try {

		if (req.params.userCode) {

			let result = undefined;

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`users.code=${req.params.userCode}`));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`users.email='${req.params.userCode}'`));

			} else {

				result = await QUERY(USER.getUserBy(`users.user='${req.params.userCode}'`));

			}

			if (result.length == 1) {

				let user = result[0];

				if (res.locals.application['apps.token'] == CONFIG.API_TOKEN) {

					next();

				} else if (user['users.appCode'] == res.locals.application['apps.code']) {

					let valid = true

					delete req.body['apps.code'];
					delete req.body['users.code'];
					delete req.body['users.registrationDate'];
					delete req.body['users.lastUpdate'];
					delete req.body['apps.registrationDate'];
					delete req.body['apps.lastUpdate'];
					delete req.body['applications.registrationDate'];
					delete req.body['applications.lastUpdate'];
					delete req.body['users.categoryCode'];
					delete req.body['apps.categoryCode'];
					delete req.body['apps.userCode'];
					delete req.body['apps.token'];

					if (req.body['users.appCode']) {

						valid = false;

						result = await QUERY(APP.getAppBy(`apps.code='${req.body['users.appCode']}'`));

						if (result.length == 1) {

							let app = result[0];

							if (app['apps.userCode'] == res.locals.application['apps.userCode']) {

								valid = true

							}

						}

					}

					if (req.body['applications.userCode']) {

						valid = false;

						result = await QUERY(APP.getAppBy(`apps.userCode='${res.locals.application['apps.useCode']}'`));

						let apps = result.map(app => app['apps.code']);

						for (let app = 0; app < apps.length && !valid; app++) {

							result = await QUERY(USER.getUserBy(`users.appCode='${apps[app]}'`));

							let users = result.map(user => user['users.code']);

							for (let user = 0; user < users.length && !valid; user++) {

								if (users[user] == req.body['applications.userCode']) {

									valid = true

								}

							}

						}

					}

					valid ? next() : res.status(200).json({status: 'error', data: [], msg: 'Error checking permissions | You do not have permissions to do that'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error checking permissions | You do not have permissions to do that'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error checking permissions | User does not exist'});

			}

		} else {

			res.status(200).json({status : 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: e});

	}

}

module.exports = {redirect, escapeHTML, checkToken, checkCalls, checkPermits, checkApp, checkStatus, filter};