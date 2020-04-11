index = (req, res) => {

	res.sendFile('/var/www/awesometracker.ddns.net/client/dist/index.html');

};

access = async (req, res) => {

	try {

		if (req.body.user != '' && req.body.password != '' && (/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(req.body.password))) {

			let result = undefined;

			result = await REQUEST.get({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.user}`, json: true, headers: {token: CONFIG.API_TOKEN}});

			if (result.data.length == 1) {

				if (PASSWORD.comparePasswords(req.body.password, result.data[0]['users.password'])) {

					QUERY(USER.insertSessionLog(result.data[0]['users.code'], 'session start', req.headers['user-agent'].split(0, 250)));

					req.session.user = {

						code: result.data[0]['users.code'],
						appCode: result.data[0]['users.appCode'],
						diff: result.data[0]['users.diff'],
						user: result.data[0]['users.user'],
						password: result.data[0]['users.password'],
						email: result.data[0]['users.email'],
						categoryCode: result.data[0]['users.categoryCode'],
						category: result.data[0]['userCategories.name'],
						name: result.data[0]['users.name'],
						surname: result.data[0]['users.surname'],
						registrationDate: result.data[0]['users.registrationDate'],
						birthDate: result.data[0]['users.birthDate']

					};

					res.status(200).json({status: 'ok', data: req.session.user});

				} else {

					res.status(200).json({status: 'error', data: 'Invalid user and password combination'});

				}

			} else {

				res.status(200).json({status: 'error', data: 'Invalid user and password combination'});

			}

		} else {

			res.status(200).json({status: 'error', data: 'Invalid values'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

};

logout = async (req, res) => {

	try {

		let userCopy = user;

		req.session.destroy(error => {

			if (!error) {

				res.status(200).json({status: 'ok', data: 'Session closed successfully'});

			} else {

				res.status(200).json({status: 'error', data: 'Logout error'});

			}

		});

	} catch (e) {

		res.status(200).json({status: 'error', data: e});

	}

}

createAccount = async (req, res) => {

	try {

		let result = await REQUEST.post({url: 'http://awesometracker.ddns.net/api/v1/users', json: true, headers: {token: CONFIG.API_TOKEN}, form: req.body});

		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e});

	}

}

forgotPassword = async (req, res) => {

	try {

		let recoverURLCode = PASSWORD.encryptPassword((new Date().getTime()).toString()).substring(10, 260);
		let recoverCode = PASSWORD.encryptPassword((new Date().getTime()).toString()).substring(10, 25);

		let result = await REQUEST.patch({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.user}`, json: true, headers: {token: CONFIG.API_TOKEN}, form: {'users.recoverURLCode': recoverURLCode, 'users.recoverCode': recoverCode}})
	
		if (result.status == 'ok') {

			result = await REQUEST.get({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.user}`, json: true, headers: {token: CONFIG.API_TOKEN}})

			let transporter = NODEMAILER.createTransport({

				service: 'gmail',
				auth: {

					user: CONFIG.EMAIL,
					pass: CONFIG.EMAIL_PASSWORD

				}

			});

			let mailOptions = {

				from: CONFIG.EMAIL,
				to: result.data[0]['users.email'],
				subject: 'Recover your account',
				html: `URL: <strong>http://awesometracker.ddns.net/recoverAccount?recoverURLCode=${recoverURLCode}</strong> <br> Code: <strong>${recoverCode}</strong>`

			};

			transporter.sendMail(mailOptions, error => {

				if (!error) {

					res.status(200).json({status: 'ok', data: [], msg: 'If the account exists an email has been sent'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error sending the email'});

				}

			});

		} else {

			res.status(200).json({status: result.status, data: result.data, msg: result.msg});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

recoverAccount = async (req, res) => {

	try {

		let result = await REQUEST.patch({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.user}`, json: true, headers: {token: CONFIG.API_TOKEN}, form: req.body});

		if (result.status == 'ok') {

			result = await REQUEST.patch({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.user}`, json: true, headers: {token: CONFIG.API_TOKEN}, form: {'users.recoverURLCode': '', 'users.recoverCode': ''}});

			result = await REQUEST.get({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.user}`, json: true, headers: {token: CONFIG.API_TOKEN}})

			let transporter = NODEMAILER.createTransport({

				service: 'gmail',
				auth: {

					user: CONFIG.EMAIL,
					pass: CONFIG.EMAIL_PASSWORD

				}

			});

			let mailOptions = {

				from: CONFIG.EMAIL,
				to: result.data[0]['users.email'],
				subject: 'Account updated',
				html: `Your account has been updated`

			};

			transporter.sendMail(mailOptions, error => {

				if (!error) {

					res.status(200).json({status: 'ok', data: [], msg: 'If the account exists an email has been sent'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error sending the email'});

				}

			});

		} else {

			res.status(200).json({status: result.status, data: result.data, msg: result.msg});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

addLog = async (req, res) => {

	try {

		let result = await REQUEST.post({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode}/trackerLogs`, json: true, headers: {token: CONFIG.API_TOKEN}, form: {'trackerLogs.app': req.body['trackerLogs.app'], 'trackerLogs.start': req.body['trackerLogs.start'], 'trackerLogs.stop': req.body['trackerLogs.stop']}});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteLog = async (req, res) => {

	try {

		let result = await REQUEST.delete({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user.code}/trackerLogs/${req.body.logCode}`, json: true, headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

addApplication = async (req, res) => {

	try {

		let result = await REQUEST.post({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user.code}/applications`, json: true, headers: {token: CONFIG.API_TOKEN}, form: {'applications.category': req.body.category, 'applications.app': req.body.app}});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

updateApplication = async (req, res) => {

	try {

		let result = await REQUEST.patch({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user.code}/applications/${req.body.applicationCode}`, json: true, headers: {token: CONFIG.API_TOKEN}, form: {'applications.category': req.body['applications.category'], 'applications.app': req.body['applications.app']}});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteApplication = async (req, res) => {

	try {

		let result = await REQUEST.delete({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user.code}/applications/${req.body.applicationCode}`, json: true, headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

updateAccount = async (req, res) => {

	try {

		let result = await REQUEST.patch({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user.code}`, json: true, headers: {token: CONFIG.API_TOKEN}, form: req.body.data});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteAccount = async (req, res) => {

	try {

		console.log('Entro');

		let result = await REQUEST.delete({url: `http://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user.code}`, json: true, headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.status, data: result.data, msg: result.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

data = async (req, res) => {

	try {

		if (req.params.operationCode) {

			let result = null;
			let query = [];
			let url = '';

			for (param in req.query) {

				if (Number(req.params.operationCode) == 1 && req.query.userCode && req.query.userCode == 1) {

					req.query.userCode = user.code;

				}

				query.push(`${param}=${req.query[param]}`);

			}

			switch(Number(req.params.operationCode)) {

				/* Obtiene el usuario de la sesion */
				case 0:

					res.status(200).json({status: 'ok', data: {user: user}});
					break;

				/* Obtiene el perfil del usuario */
				case 1:

					url = `http://awesometracker.ddns.net/api/v1/users/${req.query.userCode}`;
					break

				/* Obtiene los logs del usuario */
				case 2:

					url = `http://awesometracker.ddns.net/api/v1/users/${user.code}/trackerLogs`;
					break;

				/* Obtiene las aplicaciones del usuario */
				case 3:

					url = `http://awesometracker.ddns.net/api/v1/users/${user.code}/applications`;
					break;

					/* Obtiene todos los usuarios del sistema */
				case 4:

					url = `http://awesometracker.ddns.net/api/v1/users`;
					break;

				/* Obtiene todos los trackerLogs del sistema */
				case 5:

					url = `http://awesometracker.ddns.net/api/v1/trackerLogs`;
					break;

				/* Obtiene todos las apps del sistema */
				case 6:

					url = 'http://awesometracker.ddns.net/api/v1/apps';
					break;

				/* Obtiene todos las applications del sistema */
				case 7:

					url = 'http://awesometracker.ddns.net/api/v1/applications';
					break;

				/* Obtiene los todos los posts */
				case 8:

					url = 'http://awesometracker.ddns.net/api/v1/posts';
					break;

				/* Obtiene todas las categorias de usuario del sistema */
				case 9:

					url = `http://awesometracker.ddns.net/api/v1/userCategories`;
					break;

			}

			if (Number(req.params.operationCode) != 0) {

				if (query.length != 0) {

					url = `${url}?${query.join('&')}`;

				}

				result = await REQUEST.get({url: url, json: true, headers: {token: CONFIG.API_TOKEN}});
				res.status(200).json({status: result.status, data: result.data, msg: result.msg});

			}

		} else {

			res.status(200).json({status: 'error', data: 'Missing operation code'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e});

	}

};

module.exports = {index, access, logout, createAccount, forgotPassword, recoverAccount, data, addLog, deleteLog, addApplication, updateApplication, deleteApplication, updateAccount, deleteAccount};