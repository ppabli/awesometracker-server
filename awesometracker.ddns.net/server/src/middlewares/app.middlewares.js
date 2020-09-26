redirect = (req, res, next) => {

	if(!req.secure) {

		res.redirect('https://' + req.headers.host + req.url);

	} else {

		next();

	}

}

checkCalls = async (req, res, next) => {

	try {

		let ip = req.headers['X-Real-IP'] || /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.exec(req.ip)[0];

		QUERY(CALL.insertAppCall(ip, req.url, req.method));
		next();

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

	}

};

userConect = (req, res, next) => {

	user = req.session.user || null;
	next();

}

checkStatus = async (req, res, next) => {

	try {

		if (user['users.statusCode'] == 1) {

			next();

		} else {

			res.status(200).json({status: 'error', data: [], msg: `Invalid account status | Account status: ${user['status.name']} | Status description: ${user['status.description']}`})

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: [], msg: e, doc: 'https://awesometracker.ddns.net/docs'});

	}

}

privateRoutes = (req, res, next) => {

	if (!user) {

		res.redirect('/login');

	} else {

		next();

	}

};

adminRoutes = (req, res, next) => {

	if (user['users.categoryCode'] != CONFIG.ADMIN_CATEGORY) {

		res.redirect('/login');

	} else {

		next();

	}

};

checkPermits = async (req, res, next) => {

	let result = await AXIOS.get('https://awesometracker.ddns.net/api/v1/apps', {headers: {token: CONFIG.API_TOKEN}});

	let apps = result.data.data;
	let valid = false;

	if (user['users.categoryCode'] == CONFIG.ADMIN_CATEGORY) {

		next();

	} else {

		if (!req.body.userCode || user['users.code'] == req.body.userCode) {

			valid = true;

		} else if (apps && apps.filter(app => app['apps.userCode'] == user['users.code'])) {

			apps = apps.filter(app => app['apps.userCode'] == user['users.code']);

			let users = [];

			for (let app = 0; app < apps.length && !valid; app++) {

				let newUsers = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users?where=users.appCode=${apps[app]['apps.code']}`, {headers: {token: CONFIG.API_TOKEN}});

				users = users.concat(newUsers.data.data);

				for (let user = 0; user < users.length && !valid; user++) {

					if (users[user]['users.code'] == req.body.userCode) {

						valid = true

					}

				}

			}

		}

		valid ? next() : res.status(200).json({status: 'error', data: [], msg: 'Error checking permissions | You do not have permissions to do that', doc: 'https://awesometracker.ddns.net/docs'});

	}

};

module.exports = {redirect, checkCalls, userConect, checkStatus, privateRoutes, adminRoutes, checkPermits};