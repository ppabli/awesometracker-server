index = (req, res) => {

	res.sendFile('/awesometracker.ddns.net/client/index.html');

};

access = async (req, res) => {

	try {

		if (req.body.user != '' && req.body.password != '' && (/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(req.body.password))) {

			let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${req.body.user}`, {headers: {token: CONFIG.API_TOKEN}});

			if (result.data.data.length == 1) {

				if (PASSWORD.comparePasswords(req.body.password, result.data.data[0]['users.password'])) {

					QUERY(USER.insertSessionLog(result.data.data[0]['users.code'], 'session start', req.headers['user-agent'].split(0, 250)));

					req.session.user = result.data.data[0];

					req.session.save();

					res.status(200).json({status: 'ok', data: req.session.user, msg: 'Todo ok'});

				} else {

					res.status(200).json({status: 'error', data:[], msg: 'Invalid user or password'});

				}

			} else {

				res.status(200).json({status: 'error', data:[], msg: 'Invalid user'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Invalid values'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

};

accessGoogle = async (req, res) => {

	try {

		let client = new GOOGLE.OAuth2Client(CONFIG.CLIENT_ID);

		let ticket = await client.verifyIdToken({

			idToken: req.body.token,
			audience: CONFIG.CLIENT_ID

		});

		let user = ticket.getPayload();

		let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user.email}`, {headers: {token: CONFIG.API_TOKEN}});

		if (result.data.data.length == 1) {

			QUERY(USER.insertSessionLog(result.data.data[0]['users.code'], 'session start', req.headers['user-agent'].split(0, 250)));

			req.session.user = result.data.data[0];

			req.session.save();

			res.status(200).json({status: 'ok', data: req.session.user, msg: 'Todo ok'});

		} else {

			let data = {

				'users.user': user.name,
				'users.password': req.body.token.substring(15, 65) + '!',
				'users.email': user.email,
				'users.name': user.name.split(' ')[0],
				'users.surname': user.family_name,
				'users.birthDate': user.birthday || '1971-01-01',
				'users.imageURL': user.picture,
				'users.diff': 1

			}

			result = await AXIOS.post('https://awesometracker.ddns.net/api/v1/users', data, {headers: {token: CONFIG.API_TOKEN}});

			if (result.data.status == 'ok') {

				let result2 = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user.email}`, {headers: {token: CONFIG.API_TOKEN}});

				QUERY(USER.insertSessionLog(result2.data.data[0]['users.code'], 'session start', req.headers['user-agent'].split(0, 250)));

				req.session.user = result2.data.data[0];

				req.session.save();

				let transporter = NODEMAILER.createTransport({

					service: 'gmail',
					auth: {

						user: CONFIG.EMAIL,
						pass: CONFIG.EMAIL_PASSWORD

					}

				});

				let mailOptions = {

					from: CONFIG.EMAIL,
					to: data['users.email'],
					subject: 'New account created',
					html: `<h1>Credentials</h1>Email: ${user.email}, Password: ${req.body.token.substring(15, 65) + '!'}.<p>Use this credentials to login on the desktop app</p>`

				};

				transporter.sendMail(mailOptions);

			}

			res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error | Await 1 minute until next try'});

	}

}

logout = async (req, res) => {

	try {

		req.session.destroy(error => {

			if (!error) {

				res.status(200).json({status: 'ok', data: 'Session closed successfully'});

			} else {

				res.status(200).json({status: 'error', data: 'Logout error'});

			}

		});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

addUser = async (req, res) => {

	try {

		let data = {};

		let form = new FORMIDABLE.IncomingForm();

		let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];

		let ok = true;
		let message = '';

		form.parse(req, async function (err, fields, files) {

			if (user && user['users.categoryCode'] != CONFIG.ADMIN_CATEGORY) {

				delete fields['users.categoryCode'];

				if (fields['users.appCode']) {

					let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps`, {headers: {token: CONFIG.API_TOKEN}});

					let apps = result.data.data.map(app => Number(app['apps.code']));

					if (!apps.includes(Number(fields['users.appCode']))) {

						ok = false;
						message = 'Invalid appCode';

					}

				}

			}

			for (field in fields) {

				if (/users/.test(field)) {

					data[field] = fields[field];

				}

				if (/password/.test(field)) {

					if (!(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(fields[field]))) {

						ok = false;
						message = 'Invalid password';
						break;

					}

				}

				if (/email/.test(field)) {

					if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fields[field]))) {

						ok = false;
						message = 'Invalid email';
						break;

					}

				}

				if (/birthDate/.test(field)) {

					if (new Date() - new Date(fields[field]) <= 0) {

						ok = false;
						message = 'Invalid birthdate';
						break;

					}

				}

			}

			if (files['imageFile']) {

				let oldPath = files.imageFile.path;
				let extension = files.imageFile.name.split('.')[files.imageFile.name.split('.').length - 1];

				if (!validExtensions.includes(extension)) {

					ok = false;
					message = 'Invalid extension';

				} else {

					let fileName = `temp_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;
					let newPath = `/var/www/awesometracker.ddns.net/userImg/${fileName}`;

					FS.renameSync(oldPath, newPath);

					data['users.imageURL'] = `https://awesometracker.ddns.net/userImg/${fileName}`;

				}

			}

			if (ok) {

				result = await AXIOS.post('https://awesometracker.ddns.net/api/v1/users', data, {headers: {token: CONFIG.API_TOKEN}});

				if (result.data.status == 'ok') {

					let transporter = NODEMAILER.createTransport({

						service: 'gmail',
						auth: {

							user: CONFIG.EMAIL,
							pass: CONFIG.EMAIL_PASSWORD

						}

					});

					let mailOptions = {

						from: CONFIG.EMAIL,
						to: data['users.email'],
						subject: 'New account created',
						html: `<h1>Credentials</h1>Email: ${data['users.email']}, Password: ${data['users.password']}.<p>Use this credentials to login on the desktop app</p>`

					};

					transporter.sendMail(mailOptions);

				}

				res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

			} else {

				res.status(200).json({status: 'error', data: [], msg: `@ Invalid data provided | ${message}`});

			}

		});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

addApp = async (req, res) => {

	try {

		let data = {};

		let form = new FORMIDABLE.IncomingForm();

		let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];

		let ok = true;
		let message = '';

		form.parse(req, async function (err, fields, files) {

			if (user['users.categoryCode'] != CONFIG.ADMIN_CATEGORY) {

				delete fields['apps.categoryCode'];
				delete fields['apps.userCode'];

			}

			for (field in fields) {

				if (/apps/.test(field)) {

					data[field] = fields[field];

				}

			}

			if (files['imageFile']) {

				let oldPath = files.imageFile.path;
				let extension = files.imageFile.name.split('.')[files.imageFile.name.split('.').length - 1];

				if (!validExtensions.includes(extension)) {

					ok = false;
					message = 'Invalid extension';

				} else {

					let fileName = `temp_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;
					let newPath = `/var/www/awesometracker.ddns.net/appImg/${fileName}`;

					FS.renameSync(oldPath, newPath);

					data['users.imageURL'] = `https://awesometracker.ddns.net/appImg/${fileName}`;

				}

			}

			if (ok) {

				let result = await AXIOS.post(`https://awesometracker.ddns.net/api/v1/users/${data['apps.userCode'] || user['users.code']}/apps`, data, {headers: {token: CONFIG.API_TOKEN}});

				res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

			} else {

				res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`});

			}

		});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

forgotPassword = async (req, res) => {

	try {

		let recoverURLCode = PASSWORD.encryptPassword((new Date().getTime()).toString()).substring(10, 260);
		let recoverCode = PASSWORD.encryptPassword((new Date().getTime()).toString()).substring(10, 25);

		let result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${req.body.user}`, {'users.recoverURLCode': recoverURLCode, 'users.recoverCode': recoverCode}, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});

		if (result.data.status == 'ok') {

			result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${req.body.user}`, {headers: {token: CONFIG.API_TOKEN}});

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
				html: `URL: <strong>https://awesometracker.ddns.net/recoverUser?recoverURLCode=${recoverURLCode}</strong> <br> Code: <strong>${recoverCode}</strong>`

			};

			transporter.sendMail(mailOptions, error => {

				if (!error) {

					res.status(200).json({status: 'ok', data: [], msg: 'If the account exists an email has been sent'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error sending the email'});

				}

			});

		} else {

			res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

recoverUser = async (req, res) => {

	try {

		let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${req.body.user}?where=users.recoverURLCode='${req.body.recoverURLCode}',users.recoverCode='${req.body.recoverCode}'`, {headers: {token: CONFIG.API_TOKEN}});

		if (result.data.data.length == 1) {

			user = result.data.data[0];

			result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${req.body.user}`, {'users.password': req.body.password, 'users.recoverURLCode': '', 'users.recoverCode': ''}, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});

			if (result.data.status == 'ok') {

				let transporter = NODEMAILER.createTransport({

					service: 'gmail',
					auth: {

						user: CONFIG.EMAIL,
						pass: CONFIG.EMAIL_PASSWORD

					}

				});

				let mailOptions = {

					from: CONFIG.EMAIL,
					to: user['users.email'],
					subject: 'Account updated',
					html: `Your account has been updated`

				};

				transporter.sendMail(mailOptions, error => {

					if (!error) {

						res.status(200).json({status: 'ok', data: [], msg: 'Account sucesfully updated | If the account exists an email has been sent'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error sending the email'});

					}

				});

			} else {

				res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

			}

		} else {

			res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

addLog = async (req, res) => {

	try {

		let result = await AXIOS.post(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}/trackerLogs`, {'trackerLogs.app': req.body['trackerLogs.app'], 'trackerLogs.start': req.body['trackerLogs.start'], 'trackerLogs.stop': req.body['trackerLogs.stop']}, {headers: {token: CONFIG.API_TOKEN}});

		res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteLog = async (req, res) => {

	try {

		let result = await AXIOS.delete(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}/trackerLogs/${req.body.logCode}`, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

addApplication = async (req, res) => {

	try {

		let result = await AXIOS.post(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}/applications`, {'applications.category': req.body.category, 'applications.app': req.body.app}, {headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

updateApplication = async (req, res) => {

	try {

		let result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}/applications/${req.body.applicationCode}`, {'applications.category': req.body['applications.category'], 'applications.app': req.body['applications.app'], 'applications.userCode': req.body['applications.userCode'] || user['users.code']}, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteApplication = async (req, res) => {

	try {

		let result = await AXIOS.delete(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}/applications/${req.body.applicationCode}`, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});
		res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

updateUser= async (req, res) => {

	try {

		let data = {};

		let form = new FORMIDABLE.IncomingForm();

		let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];

		let ok = true;
		let message = '';

		form.parse(req, async function (err, fields, files) {

			if (user['users.categoryCode'] != CONFIG.ADMIN_CATEGORY && fields['users.code'] != user['users.code']) {

				delete fields['users.categoryCode'];

				if (fields['users.appCode']) {

					let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps`, {headers: {token: CONFIG.API_TOKEN}});

					let apps = result.data.data.map(app => Number(app['apps.code']));

					if (!apps.includes(Number(fields['users.appCode']))) {

						ok = false;
						message = 'Invalid appCode';

					}

				}

				if (fields['users.code']) {

					let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${fields['users.code']}`, {headers: {token: CONFIG.API_TOKEN}});

					if (result.data.status == 'ok' && result.data.data.length == 1) {

						let finalUser = result.data.data[0];

						result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps`, {headers: {token: CONFIG.API_TOKEN}});

						let apps = result.data.data.map(app => Number(app['apps.code']));

						if (!apps.includes(Number(finalUser['users.appCode']))) {

							ok = false;
							message = 'Invalid user';

						}

					} else {

						ok = false;
						message = 'Invalid user'

					}

				}

			}

			for (field in fields) {

				if (/users/.test(field)) {

					data[field] = fields[field];

				}

				if (/password/.test(field)) {

					if (!(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(fields[field]))) {

						ok = false;
						message = 'Invalid password';
						break;

					}

				}

				if (/email/.test(field)) {

					if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fields[field]))) {

						ok = false;
						message = 'Invalid email';
						break;

					}

				}

				if (/birthDate/.test(field)) {

					if (new Date() - new Date(fields[field]) <= 0) {

						ok = false;
						message = 'Invalid birthdate';
						break;

					}

				}

			}

			if (files['imageFile']) {

				let oldPath = files.imageFile.path;
				let extension = files.imageFile.name.split('.')[files.imageFile.name.split('.').length - 1];
				let fileName = `${fields['users.code'] || user['users.code']}_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;
				let newPath = `/var/www/awesometracker.ddns.net/userImg/${fileName}`;

				if (!validExtensions.includes(extension)) {

					ok = false;
					message = 'Invalid extension';

				}

				FS.renameSync(oldPath, newPath);

				data['users.imageURL'] = `https://awesometracker.ddns.net/userImg/${fileName}`;

			}

			if (ok) {

				result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${fields['users.code'] || user['users.code']}`, data, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});

				if (result.data.status == 'ok' && user['users.code'] == fields['users.code']) {

					let result2 = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${fields['users.code'] || user['users.code']}`, {headers: {token: CONFIG.API_TOKEN}});

					req.session.user = result2.data.data[0];

					res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

				} else {

					res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`});

			}

		});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteUser = async (req, res) => {

	try {

		let result = await AXIOS.delete(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}`, {headers: {token: CONFIG.API_TOKEN}});

		if (result.data.status == 'ok' && ((req.body.userCode && req.body.userCode == user['users.code']) || !req.body.userCode)) {

			req.session.destroy();

		}

		res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});


	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

updateApp = async (req, res) => {

	try {

		let data = {};

		let form = new FORMIDABLE.IncomingForm();

		let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];

		let ok = true;
		let message = '';

		form.parse(req, async function (err, fields, files) {

			if (user['users.categoryCode'] != CONFIG.ADMIN_CATEGORY) {

				delete fields['apps.categoryCode'];
				delete fields['apps.userCode'];

			}

			for (field in fields) {

				if (/apps/.test(field)) {

					data[field] = fields[field];

				}

			}

			if (files['imageFile']) {

				let oldPath = files.imageFile.path;
				let extension = files.imageFile.name.split('.')[files.imageFile.name.split('.').length - 1];
				let fileName = `${fields['apps.code']}_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;
				let newPath = `/var/www/awesometracker.ddns.net/appImg/${fileName}`;

				if (!validExtensions.includes(extension)) {

					ok = false;
					message = 'Invalid extension';

				}

				FS.renameSync(oldPath, newPath);

				data['apps.imageURL'] = `https://awesometracker.ddns.net/appImg/${fileName}`;

			}

			if (ok) {

				result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${fields['originalUserCode'] || user['users.code']}/apps/${fields['apps.code']}`, data, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});

				if (result.status == 'ok' && user['users.code'] == fields['apps.useCode']) {

					res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

				} else {

					res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`});

			}

		});

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteApp = async (req, res) => {

	let result = await AXIOS.delete(`https://awesometracker.ddns.net/api/v1/users/${req.body.userCode || user['users.code']}/apps/${req.body.appCode}`, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});
	res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

}

data = async (req, res) => {

	try {

		if (req.params.operationCode) {

			let result = null;
			let query = [];
			let url = '';

			let exceptions = ['userCode', 'appCode'];

			for (param in req.query) {

				if (exceptions.includes(param)) {

					continue;

				} else {

					query.push(`${param}=${req.query[param]}`);

				}

			}

			switch(Number(req.params.operationCode)) {

				/* Obtiene el usuario de la sesion */
				case 0:

					res.status(200).json({status: 'ok', data: {user: user}});
					break;

				/* Obtiene el perfil del usuario */
				case 1:

					url = `https://awesometracker.ddns.net/api/v1/users/${req.query.userCode}`;
					break

				/* Obtiene los logs del usuario */
				case 2:

					url = `https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/trackerLogs`;
					break;

				/* Obtiene las aplicaciones del usuario */
				case 3:

					url = `https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/applications`;
					break;

				/* Obtiene todos los usuarios del sistema */
				case 4:

					url = `https://awesometracker.ddns.net/api/v1/users`;
					break;

				/* Obtiene todos los trackerLogs del sistema */
				case 5:

					url = `https://awesometracker.ddns.net/api/v1/trackerLogs`;
					break;

				/* Obtiene todos las apps del sistema */
				case 6:

					url = 'https://awesometracker.ddns.net/api/v1/apps';
					break;

				/* Obtiene todos las applications del sistema */
				case 7:

					url = 'https://awesometracker.ddns.net/api/v1/applications';
					break;

				/* Obtiene los todos los posts */
				case 8:

					url = 'https://awesometracker.ddns.net/api/v1/posts';
					break;

				/* Obtiene todas las categorias de usuario del sistema */
				case 9:

					url = `https://awesometracker.ddns.net/api/v1/userCategories`;
					break;

				/* Obtiene las llamdas a la API de las apps */
				case 10:

					url = `https://awesometracker.ddns.net/api/v1/users/${req.query.userCode || user['users.code']}/apps/${req.query.appCode}/apiCalls`;
					break;

				/* Obtiene las apps del usuario */
				case 11:

					url = `https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps`;
					break;

				/* Obtiene todos los status disponibles */
				case 12:

					url = `https://awesometracker.ddns.net/api/v1/status`;
					break;

				/* Obtiene todas las categories de las apps */
				case 13:
					url = `https://awesometracker.ddns.net/api/v1/appCategories`;
					break;

				/* Devuleve un nuevo token correcto */
				case 14:
					let token = PASSWORD.encryptPassword(String(new Date().getTime()));
					res.status(200).json({status: 'ok', data: token});
					break;

				/* Devuelve las categorias de los posts */
				case 15:
					url = `https://awesometracker.ddns.net/api/v1/postCategories`;
					break;
	
				/* Devuelve las todas las API Calls del sistema */
				case 16:
					url = `https://awesometracker.ddns.net/api/v1/apiCalls`;
					break;

			}

			if (Number(req.params.operationCode) != 0 && Number(req.params.operationCode) != 14) {

				if (query.length != 0) {

					url = `${url}?${query.join('&')}`;

				}

				result = await AXIOS.get(url, {headers: {token: CONFIG.API_TOKEN}});

				res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

			}

		} else {

			res.status(200).json({status: 'error', data: 'Missing operation code'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

};

getIndexPosts = async (req, res) => {

	let result = await AXIOS.get('https://awesometracker.ddns.net/api/v1/posts?where=posts.categoryCode!=1&orderBy=posts.code&order=desc', {headers: {token: CONFIG.API_TOKEN}});
	res.status(200).json({status: result.data.status, data: result.data.data, msg: result.data.msg});

}

createUserTransaction = async (req, res) => {

	let result = await AXIOS.get('https://awesometracker.ddns.net/api/v1/userCategories', {headers: {token: CONFIG.API_TOKEN}});

	let price = undefined;
	let name = undefined;

	if (req.body.option == 1 || req.body.option >= user['users.categoryCode']) {

		req.body.option = user['users.categoryCode'];

		price = String(0);
		name = String('NAH');

	} else {

		price = String(result.data.data[req.body.option - 1]['userCategories.price']);
		name = String(result.data.data[req.body.option - 1]['userCategories.name']) + ' account upgrade';

	}

	const request = new PAYPAL.orders.OrdersCreateRequest();

	request.prefer("return=representation");

	request.requestBody({

		intent: 'CAPTURE',
		purchase_units: [{

			description: "Account upgrade",
			amount: {

				currency_code: 'EUR',
				value: price,
				tax_total: {

					currency_code: "EUR",
					value: "20.00"

				},
				shipping_discount: {

					currency_code: "EUR",
					value: "20.00"

				},
				items: [{

					name: name,
					description: req.body.option,
					unit_amount: {

						currency_code: "EUR",
						value: price

					},

				}]

			}

		}]

	});

	let order;

	try {

		order = await PAYPAL_CLIENT.client().execute(request);

	} catch (err) {

		return res.status(200).json({status: 'error', data: [], msg: 'Error during payment'});

	}

	return res.status(200).json({status: 'ok', data: [], msg: '', orderID: order.result.id});

}

captureUserTransaction = async (req, res) => {

	const orderID = req.body.orderID;

	const request = new PAYPAL.orders.OrdersCaptureRequest(orderID);
	request.requestBody({});

	try {

		const capture = await PAYPAL_CLIENT.client().execute(request);

		const captureID = capture.result.purchase_units[0].payments.captures[0].id;

		if (captureID) {

			let total = Number(capture.result.purchase_units[0].payments.captures[0].amount.value);

			let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/userCategories?where=userCategories.price=${total}`, {headers: {token: CONFIG.API_TOKEN}});

			let newCategory = result.data.data[0]['userCategories.code'];

			result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}`, {'users.categoryCode': newCategory}, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});

			if (result.data.status == 'ok' && user['users.code'] == req.params.userCode) {

				result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}`, {headers: {token: CONFIG.API_TOKEN}});

				req.session.user = result.data.data[0];

				res.status(200).json({status: 'ok', data: [], msg: 'Payment made successfully. Your account has been updated. Thank you'});

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error updating account'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Invalid orderID'});

		}

	} catch (err) {

		res.status(200).json({status: 'error', data: [], msg: 'Error during payment'});

	}

}

createAppTransaction = async (req, res) => {

	let result = await AXIOS.get('https://awesometracker.ddns.net/api/v1/appCategories', {headers: {token: CONFIG.API_TOKEN}});

	let result2 = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps/${req.params.appCode}`, {headers: {token: CONFIG.API_TOKEN}});
	let app = result2.data.data[0];

	let price = undefined;
	let name = undefined;

	if (req.body.option == 1 || req.body.option >= app['apps.categoryCode']) {

		req.body.option = app['apps.categoryCode'];

		price = String(0);
		name = String('NAH');

	} else {

		price = String(result.data.data[req.body.option - 1]['appCategories.price']);
		name = String(result.data.data[req.body.option - 1]['appCategories.name']) + ' account upgrade';

	}

	const request = new PAYPAL.orders.OrdersCreateRequest();

	request.prefer("return=representation");

	request.requestBody({

		intent: 'CAPTURE',
		purchase_units: [{

			description: "Account upgrade",
			amount: {

				currency_code: 'EUR',
				value: price,
				tax_total: {

					currency_code: "EUR",
					value: "20.00"

				},
				shipping_discount: {

					currency_code: "EUR",
					value: "20.00"

				},
				items: [{

					name: name,
					description: req.body.option,
					unit_amount: {

						currency_code: "EUR",
						value: price

					},

				}]

			}

		}]

	});

	let order;

	try {

		order = await PAYPAL_CLIENT.client().execute(request);

	} catch (err) {

		return res.status(200).json({status: 'error', data: [], msg: 'Error during payment'});

	}

	return res.status(200).json({status: 'ok', data: [], msg: '', orderID: order.result.id});

}

captureAppTransaction = async (req, res) => {

	const orderID = req.body.orderID;

	const request = new PAYPAL.orders.OrdersCaptureRequest(orderID);
	request.requestBody({});

	try {

		const capture = await PAYPAL_CLIENT.client().execute(request);

		const captureID = capture.result.purchase_units[0].payments.captures[0].id;

		if (captureID) {

			let total = Number(capture.result.purchase_units[0].payments.captures[0].amount.value);

			let result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/appCategories?where=appCategories.price=${total}`, {headers: {token: CONFIG.API_TOKEN}});

			let newCategory = result.data.data[0]['appCategories.code'];

			result = await AXIOS.patch(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps/${req.params.appCode}`, {'apps.categoryCode': newCategory}, {responseType: 'json', headers: {token: CONFIG.API_TOKEN}});

			if (result.data.status == 'ok' && user['users.code'] == req.params.userCode) {

				result = await AXIOS.get(`https://awesometracker.ddns.net/api/v1/users/${user['users.code']}/apps/${req.params.appCode}`, {headers: {token: CONFIG.API_TOKEN}});

				res.status(200).json({status: 'ok', data: [], msg: 'Payment made successfully. Your app has been updated. Thank you'});

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error updating app'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Invalid orderID'});

		}

	} catch (err) {

		res.status(200).json({status: 'error', data: [], msg: 'Error during payment'});

	}

}

module.exports = {index, access, accessGoogle, logout, forgotPassword, recoverUser, data, getIndexPosts, addLog, deleteLog, addApplication, updateApplication, deleteApplication, addUser, updateUser, deleteUser, addApp, updateApp, deleteApp, createUserTransaction, captureUserTransaction, createAppTransaction, captureAppTransaction};