/* ------------------------------------------ General ------------------------------------------ */
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

			let result = await QUERY(APP.checkToken(req.headers.token));

			if (result.length != 0) {

				res.locals.application = result[0];
				next();

			} else {

				res.status(200).json({status: 'error', data: 'The provided token is not correct'});

			}

		} else {

		res.status(200).json({'status': 'error', 'data': 'No token has been provided'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e});

	}

};

checkCalls = async (req, res, next) => {

	try {

		let result = await QUERY(APP.countCalls(res.locals.application.code));

		if (result.length != 0) {

			let calls = result[0]['count(*)'];

			result = await QUERY(APP.getMaximumCallsBy('code', res.locals.application.categoryCode));

			if (result.length != 0) {

				let maximumCalls = result[0]['maximumCalls'];

				if (maximumCalls == 0 || calls < maximumCalls) {

					QUERY(RECORDER.insertApiCall(res.locals.application.code, req.url, req.method));
					next();

				} else {

					res.status(200).json({status : 'error', data : 'The maximum number of requests has been exceeded'})

				}

			}

		}

	} catch (e) {

		res.status(200).json({status: 'error', data : e});

	}

};

filter = (req, res, next) => {

	try {

		if (res.locals.application.token == CONFIG.API_TOKEN) {

			next();

		} else {

			let filters = req.query.filter ? req.query.filter.split(',') : null;

			for (filter in filters) {

				if (/password/.test(filters[filter].toLowerCase()) || /recover/.test(filters[filter].toLowerCase()) || /description/.test(filters[filter].toLowerCase()) || /price/.test(filters[filter].toLowerCase()) || /token/.test(filters[filter].toLowerCase()) || /maximumCalls/.test(filters[filter].toLowerCase())) {

					filters.splice(filter, 1);

				}

			}

			if (filters && filters.length != 0) {

				req.query.filter = filters.join(',')

			} else {

				if (/trackerLogs/.test(req.route.path)) {

					req.query.filter = 'trackerLogs.code,trackerLogs.userCode,trackerLogs.applicationCode,trackerLogs.start,trackerLogs.stop,trackerLogs.duration';

				} else if (/applications/.test(req.route.path)) {

					req.query.filter = 'applications.code,applications.userCode,applications.category,applications.app';

				} else if (/users/.test(req.route.path)) {

					req.query.filter = 'users.code,users.appCode,users.diff,users.user,users.email,users.categoryCode,users.name,users.surname';

				} else if (/apps/.test(req.route.path)) {

					req.query.filter = 'apps.code,apps.userCode,apps.categoryCode,apps.name';

				}

			}

			next();

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

checkPermits = async (req, res, next) => {

	try {

		if (req.params.userCode) {

			let result = undefined;

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.getUserBy({'users.code': req.params.userCode}));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.getUserBy({'users.email': req.params.userCode}));

			} else {

				result = await QUERY(USER.getUserBy({'users.user': req.params.userCode}));

			}

			if (result.length != 0) {

				let user = result[0];

				if (user['users.appCode'] == res.locals.application.code || res.locals.application.token == CONFIG.API_TOKEN) {

					if ((req.session.user && req.session.user.categoryCode == CONFIG.ADMIN_CATEGORY)) {

						next();

					} else if (req.session.user && req.session.user.code == user.code) {

						// TODO Limpiar body parcial
						next();

					} else {

						// TODO Limpiar body
						next();

					}

				} else {

					res.status(200).json({status: 'error', data: 'Error checking permissions | You do not have permissions to do that'});

				}

			} else {

				res.status(200).json({status: 'error', data: 'Error checking permissions | User does not exist'});

			}

		} else {

			res.status(200).json({status : 'error', data : 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e});

	}

}

/* ------------------------------------------ x ------------------------------------------ */

module.exports = {escapeHTML, checkToken, checkCalls, checkPermits, filter};