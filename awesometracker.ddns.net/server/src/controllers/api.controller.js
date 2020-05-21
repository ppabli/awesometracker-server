getInvalidURL = (req, res) => {

	res.status(200).json({status: 'error', data: [], msg: 'Invalid URL check the manual to check the issue', doc: 'https://awesometracker.ddns.net/docs'});

}

getUsers = async (req, res) => {

	try {

		if (req.params.userCode) {

			let result = undefined;

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`${req.query.where},users.code=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`${req.query.where},users.email='${req.params.userCode}'`, req.query.filter, req.query.orderBy, req.query.order));

			} else {

				result = await QUERY(USER.getUserBy(`${req.query.where},users.user='${req.params.userCode}'`, req.query.filter, req.query.orderBy, req.query.order));

			}

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			let result = await QUERY(USER.getUserBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

};

addUser = async (req, res) => {

	try {

		let error = false;
		let ok = true;

		for (param in req.body) {

			if (req.body[param] == '') {

				ok = false;
				message = 'Miss some data';
				break;

			}

			if (/password/.test(param)) {

				if (!(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(req.body[param]))) {

					ok = false;
					message = 'Invalid password';
					break;

				}

			}

			if (/email/.test(param)) {

				if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body[param]))) {

					ok = false;
					message = 'Invalid email';
					break;

				}

			}

			if (/diff/.test(param)) {

				if (isNaN(req.body[param])) {

					ok = false;
					message = 'Invalid diff';
					break;

				}

			}

			if (/birthDate/.test(param)) {

				if (new Date() - new Date(req.body[param]) <= 0) {

					ok = false;
					message = 'Invalid birthdate';
					break;

				}

			}

			if (/appCode/.test(param)) {

				let result = await QUERY(APP.getAppBy(`apps.code=${req.body[param]}`));

				if (result.length == 0) {

					ok = false;
					message = 'Invalid appCode';
					break;

				}

			}

			if (/categoryCode/.test(param)) {

				let result = await QUERY(USER_CATEGORY.getUserCategoryBy(`userCategories.code=${req.body[param]}`));

				if (result.length == 0) {

					ok = false;
					message = 'Invalid categoryCode';
					break;

				}

			}

			if (/statusCode/.test(param)) {

				let result = await QUERY(STATUS.getStatusBy(`status.code=${req.body[param]}`));

				if (result.length == 0) {

					ok = false;
					message = 'Invalid status';
					break;

				}

			}

			if (/visibility/.test(param)) {

				if (req.body[param] != 'public' && req.body[param] != 'private') {

					ok = false;
					message = 'Invalid visibility';
					break;

				}

			}

			if (/imageURL/.test(param)) {

				if (!/awesometracker.ddns.net\/userImg/.test(req.body[param]) && !/googleusercontent/.test(req.body[param])) {

					let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];
					let extension = req.body[param].split('.')[req.body[param].split('.').length - 1];

					if (!validExtensions.includes(extension)) {

						ok = false;
						message = 'Invalid extension';
						break;

					} else {

						try {

							await REQUEST.get(req.body[param]);

							var fileName = `temp_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;

							REQUEST2(req.body[param]).pipe(FS.createWriteStream(`/var/www/awesometracker.ddns.net/userImg/${fileName}`));

							req.body[param] = `https://awesometracker.ddns.net/userImg/${fileName}`;

						} catch (e) {

							ok = false;
							message = 'Invalid URL';
							break;

						}

					}

				} else if (/googleusercontent/.test(req.body[param])) {

					try {

						await REQUEST.get(req.body[param]);

						var fileName = `temp_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}`;

						REQUEST2(req.body[param]).pipe(FS.createWriteStream(`/var/www/awesometracker.ddns.net/userImg/${fileName}`));

						req.body[param] = `https://awesometracker.ddns.net/userImg/${fileName}`;

					} catch (e) {

						ok = false;
						message = 'Invalid URL';
						break;

					}

				} else if (/temp/.test(req.body[param])) {

					var fileName = req.body[param].split('/userImg/')[1];

				}

			}

		}

		if (ok) {

			let result = await QUERY(USER.checkUser(req.body['users.user'], req.body['users.email'], req.body['users.name'], req.body['users.surname']));

			if (result.length == 0) {

				let user = new USER(res.locals.application['apps.code'], req.body['users.user'], req.body['users.password'], req.body['users.email'], req.body['users.name'], req.body['users.surname'], req.body['users.birthDate'], req.body['users.diff'] || undefined, req.body['users.imageURL'] || undefined, req.body['users.statusCode'] || undefined , req.body['users.categoryCode'] || undefined, req.body['users.visibility'] || undefined);

				result = await QUERY(user.insert());

				if (result.length != 0) {

					result = await QUERY(USER.getUserBy(`users.email='${req.body['users.email']}'`));

					user = result[0];

					if (fileName) {

						let newFile = `${user['users.code']}_${fileName.split('_')[1]}`;

						FS.rename(`/var/www/awesometracker.ddns.net/userImg/${fileName}`, `/var/www/awesometracker.ddns.net/userImg/${newFile}`, async () => {

							result = await QUERY(USER.updateUserBy(`users.code=${user['users.code']}`, {'users.imageURL': `https://awesometracker.ddns.net/userImg/${newFile}`}));

						});

					}

					res.status(200).json({status: 'ok', data: [], msg: 'User successfully created', doc: 'https://awesometracker.ddns.net/docs'});

				} else {

					error = !error;
					res.status(200).json({status: 'error', data: [], msg: 'Error creating user', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				error = !error;
				res.status(200).json({status: 'error', data: [], msg: 'Error creating user | Duplicate record', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			error = !error;
			res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`, doc: 'https://awesometracker.ddns.net/docs'});

		}

		if (!ok || error) {

			FS.unlink('/var/www/awesometracker.ddns.net/userImg/' + fileName, () => {});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

};

updateUser = async (req, res) => {

	try {

		let error = false;
		let ok = true;

		if (req.params.userCode) {

			let result = undefined;

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`users.code=${req.params.userCode}`));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`users.email='${req.params.userCode}'`));

			} else {

				result = await QUERY(USER.getUserBy(`users.user='${req.params.userCode}'`));

			}

			let user = result[0];

			result = await QUERY(USER.checkUserException((req.body.user || user['users.user']), (req.body.email || user['users.email']), (req.body.name || user['users.name']), (req.body.surname || user['users.surname']), user['users.code']));

			if (result.length == 0) {

				for (param in req.body) {

					if (req.body[param] == '' && !/recover/.test(param)) {

						ok = false;
						message = 'Miss some data';
						break;

					}

					if (/password/.test(param)) {

						if (!(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(req.body[param]))) {

							ok = false;
							message = 'Invalid password';
							break;

						}

					}

					if (/email/.test(param)) {

						if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body[param]))) {

							ok = false;
							message = 'Invalid email';
							break;

						}

					}

					if (/diff/.test(param)) {

						if (isNaN(req.body[param])) {

							ok = false;
							message = 'Invalid diff';
							break;

						}

					}

					if (/birthDate/.test(param)) {

						if (new Date() - new Date(req.body[param]) <= 0) {

							ok = false;
							message = 'Invalid birthdate';
							break;

						}

					}

					if (/appCode/.test(param)) {

						let result = await QUERY(APP.getAppBy(`apps.code=${req.body[param]}`));

						if (result.length == 0) {

							ok = false;
							message = 'Invalid appCode';
							break;

						}

					}

					if (/categoryCode/.test(param)) {

						let result = await QUERY(USER_CATEGORY.getUserCategoryBy(`userCategories.code=${req.body[param]}`));

						if (result.length == 0) {

							ok = false;
							message = 'Invalid categoryCode';
							break;

						} else {

							if (req.body[param] > user['users.categoryCode']) {

								let actualApps = await QUERY(USER_CATEGORY.getUserCategoryBy(`userCategories.code=${user['users.categoryCode']}`));

								let newApps = await QUERY(USER_CATEGORY.getUserCategoryBy(`userCategories.code=${req.body[param]}`));

								result = await QUERY(APP.getAppBy(`apps.userCode=${user['users.code']}`, undefined, 'apps.code', 'DESC'));

								let apps = result;

								if (apps.length > newApps['apps.maximumApps'] && newApps['apps.maximumApps'] != 0) {

									let diff = Math.abs(actualApps['apps.maximumApps'] - newApps['apps.maximumApps']);

									for (let app = 0; app < diff && app < apps.length; app++) {

										result = await QUERY(USER.getUserBy(`users.appCode=${apps[app]['apps.code']}`));

										let users = result

										for (user in users) {

											await await QUERY(USER.updateUserBy(`users.code=${users[user]['users.code']}`, {'users.statusCode': req.body[param]}));

										}

										await await QUERY(APP.updateAppBy(`apps.code=${apps[app]['apps.code']}`, {'apps.statusCode': req.body[param]}));

									}

								}

							}

						}

					}

					if (/status/.test(param)) {

						let result = await QUERY(STATUS.getStatusBy(`status.code=${req.body[param]}`));

						if (result.length == 0) {

							ok = false;
							message = 'Invalid status';
							break;

						} else {

							if (req.body[param] > 1) {

								result = await QUERY(APP.getAppBy(`apps.userCode=${user['users.code']}`));

								let apps = result;

								for (app in apps) {

									result = await QUERY(USER.getUserBy(`users.appCode=${apps[app]['apps.code']}`));

									let users = result

									for (user in users) {

										await QUERY(USER.updateUserBy(`users.code=${users[user]['users.code']}`, {'users.statusCode': req.body[param]}));

									}

									await QUERY(APP.updateAppBy(`apps.code=${apps[app]['apps.code']}`, {'apps.statusCode': req.body[param]}));

								}

							}

						}

					}

					if (/imageURL/.test(param)) {

						if (!/awesometracker.ddns.net\/userImg/.test(req.body[param])) {

							let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];
							let extension = req.body[param].split('.')[req.body[param].split('.').length - 1];

							if (!validExtensions.includes(extension)) {

								ok = false;
								message = 'Invalid extension';
								break;

							} else {

								try {

									await REQUEST.get(req.body[param]);

									let fileName = `${user['users.code']}_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;

									await REQUEST(req.body[param]).pipe(FS.createWriteStream(`/var/www/awesometracker.ddns.net/userImg/${fileName}`, () => {

										req.body[param] = `https://awesometracker.ddns.net/userImg/${fileName}`;

										FS.readdir('/var/www/awesometracker.ddns.net/userImg/', (err, files) => {

											for (file in files) {

												if (files[file].split('_')[0] == user['users.code'] && files[file] != req.body[param].split('/')[req.body[param].split('/').length - 1]) {

													FS.unlink('/var/www/awesometracker.ddns.net/userImg/' + files[file], () => {});

												}

											};

										});

									}));

								} catch (e) {

									ok = false;
									message = 'Invalid URL';
									break;

								}

							}

						} else {

							FS.readdir('/var/www/awesometracker.ddns.net/userImg/', (err, files) => {

								for (file in files) {

									if (files[file].split('_')[0] == user['users.code'] && files[file] != req.body[param].split('/')[req.body[param].split('/').length - 1]) {

										FS.unlink('/var/www/awesometracker.ddns.net/userImg/' + files[file], () => {});

									}

								};

							});

						}

					}

				}

				if (ok) {

					req.body['users.lastUpdate'] = 'current_timestamp()';

					result = await QUERY(USER.updateUserBy(`users.code=${user['users.code']}`, req.body));

					if (result) {

						res.status(200).json({status: 'ok', data: [], msg: 'User successfully updated', doc: 'https://awesometracker.ddns.net/docs'});

					} else {

						error = !error;
						res.status(200).json({status: 'error', data: [], msg: 'Error updating user', doc: 'https://awesometracker.ddns.net/docs'});

					}

				} else {

					error = !error;
					res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`, doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				error = !error;
				res.status(200).json({status: 'error', data: [], msg: 'Error updating user - Duplicate record', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			error = !error;
			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

		if (!ok || error) {

			FS.unlink('/var/www/awesometracker.ddns.net/userImg/' + fileName, () => {});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

deleteUser = async (req, res) => {

	try {

		let result = undefined;

		if (req.params.userCode) {

			result = await QUERY(APP.getAppBy(`apps.userCode=${req.params.userCode}`));

			let apps = result;

			for (app in apps) {

				await REQUEST.delete({url: `https://awesometracker.ddns.net/api/v1/users/${req.params.userCode}/apps/${apps[app]['apps.code']}`, json: true, headers: {token: CONFIG.API_TOKEN}});

			}

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.deleteUserBy(`users.code=${req.params.userCode}`));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.deleteUserBy(`users.email='${req.params.userCode}'`));

			} else {

				result = await QUERY(USER.deleteUserBy(`users.user='${req.params.userCode}'`));

			}

			if (result.length != 0) {

				FS.readdir('/var/www/awesometracker.ddns.net/userImg/', (err, files) => {

					for (file in files) {

						if (files[file].split('_')[0] == req.params.userCode) {

							FS.unlink('/var/www/awesometracker.ddns.net/userImg/' + files[file], () => {});

						}

					};

				});

				res.status(200).json({status: 'ok', data: [], msg: 'User successfully deleted', doc: 'https://awesometracker.ddns.net/docs'});

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error deleting user', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getTrackerLogs = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(`${req.query.where},trackerLogs.userCode=${req.params.userCode},trackerLogs.code=${req.params.trackerLogCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(`${req.query.where},trackerLogs.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		} else {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(`${req.query.where},trackerLogs.code=${req.params.trackerLogCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

addTrackerLog = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.body['trackerLogs.app'] && req.body['trackerLogs.start'] && req.body['trackerLogs.stop']) {

				let result= await QUERY(APPLICATION.getApplicationBy(`applications.userCode=${req.params.userCode},applications.app='${req.body['trackerLogs.app']}'`));

				if (result.length == 0) {

					let newApplication = new APPLICATION(req.params.userCode, 'unknown', req.body['trackerLogs.app']);
					QUERY(newApplication.insert());
					result= await QUERY(APPLICATION.getApplicationBy(`applications.userCode=${req.params.userCode},applications.app='${req.body['trackerLogs.app']}'`));

				}

				let newTrackerLog = new TRACKERLOG(req.params.userCode, result[0]['applications.code'], req.body['trackerLogs.start'], req.body['trackerLogs.stop']);

				result = await QUERY(newTrackerLog.insert());

				if (result.length != 0) {

					res.status(200).json({status: 'ok', data: [], msg: 'Log successfully created', doc: 'https://awesometracker.ddns.net/docs'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error creating the log', doc: 'https://awesometracker.ddns.net/docs'})

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Data missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'User code missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

};

deleteLog = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.deleteTrackerLogBy(`trackerLogs.userCode=${req.params.userCode},trackerLogs.code=${req.params.trackerLogCode}`));

				if (result.length != 0) {

					res.status(200).json({status: 'ok', data: [], msg: 'Log successfully deleted', doc: 'https://awesometracker.ddns.net/docs'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error deleting log', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Trackerlog code missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getApplications = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.getApplicationBy(`${req.query.where},applications.userCode=${req.params.userCode},applications.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(APPLICATION.getApplicationBy(`${req.query.where},applications.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		} else {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.getApplicationBy(`${req.query.where},applications.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(APPLICATION.getApplicationBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

addApplication = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.body['applications.category'] && req.body['applications.app']) {

				let exists = await QUERY(APPLICATION.getApplicationBy(`applications.userCode=${req.params.userCode},applications.app='${req.body['applications.app']}'`));

				if (exists.length == 0) {

					let newApplication = new APPLICATION(req.params.userCode, req.body['applications.category'], req.body['applications.app']);

					let result = await QUERY(newApplication.insert());

					if (result.length != 0) {

						res.status(200).json({status: 'ok', data: [], msg: 'Aplication successfully created', doc: 'https://awesometracker.ddns.net/docs'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error creating aplication', doc: 'https://awesometracker.ddns.net/docs'})

					}

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error creating aplication - Duplicate record', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Data missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

updateApplication = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.checkApplicationException(req.params.applicationCode, req.params.userCode, req.body['applications.app']));

				if (result.length == 0) {

					req.body['applications.lastUpdate'] = 'current_timestamp()';

					result = await QUERY(APPLICATION.updateApplicationBy(`applications.userCode=${req.params.userCode},applications.code=${req.params.applicationCode}`, req.body));

					if (result.length != 0) {

						res.status(200).json({status: 'ok', data: [], msg: 'Application successfully updated', doc: 'https://awesometracker.ddns.net/docs'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error updating application', doc: 'https://awesometracker.ddns.net/docs'});

					}

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error updating application | Duplicated application', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Application code missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

deleteApplication = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.deleteApplicationBy(`applications.userCode=${req.params.userCode},applications.code=${req.params.applicationCode}`));

				if (result.length != 0) {

					res.status(200).json({status: 'ok', data: [], msg: 'Application successfully deleted', doc: 'https://awesometracker.ddns.net/docs'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error deleting application', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Application code missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getApps = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APP.getAppBy(`${req.query.where},apps.userCode=${req.params.userCode},apps.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(APP.getAppBy(`${req.query.where},apps.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		} else {

			if (req.params.applicationCode) {

				let result = await QUERY(APP.getAppBy(`${req.query.where},apps.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(APP.getAppBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

addApp = async (req, res) => {

	try {

		let error = false;
		let ok = true;

		for (param in req.body) {

			if (req.body[param] == '') {

				ok = false;
				message = 'Miss some data';
				break;

			}

			if (/userCode/.test(param)) {

				let result = await QUERY(USER.getUserBy(`users.code=${req.body[param]}`));

				if (result.length == 0) {

					ok = false;
					message = 'Invalid usercode';
					break;

				}

			}

			if (/categoryCode/.test(param)) {

				let result = await QUERY(APP_CATEGORY.getAppCategoryBy(`appCategories.code=${req.body[param]}`));

				if (result.length == 0) {

					ok = false;
					message = 'Invalid categoryCode';
					break;

				}

			}

			if (/statusCode/.test(param)) {

				let result = await QUERY(STATUS.getStatusBy(`status.code=${req.body[param]}`));

				if (result.length == 0) {

					ok = false;
					message = 'Invalid status';
					break;

				}

			}

			if (/visibility/.test(param)) {

				if (req.body[param] != 'public' && req.body[param] != 'private') {

					ok = false;
					message = 'Invalid visibility';
					break;

				}

			}

			if (/imageURL/.test(param)) {

				if (!/awesometracker.ddns.net\/appImg/.test(req.body[param])) {

					let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];
					let extension = req.body[param].split('.')[req.body[param].split('.').length - 1];

					if (!validExtensions.includes(extension)) {

						ok = false;
						message = 'Invalid extension';
						break;

					} else {

						try {

							await REQUEST.get(req.body[param]);

							var fileName = `temp_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;

							REQUEST2(req.body[param]).pipe(FS.createWriteStream(`/var/www/awesometracker.ddns.net/appImg/${fileName}`));

							req.body[param] = `https://awesometracker.ddns.net/appImg/${fileName}`;

						} catch (e) {

							ok = false;
							message = 'Invalid URL';
							break;

						}

					}

				} else if (/temp/.test(req.body[param])) {

					var fileName = req.body[param].split('/appImg/')[1];

				}

			}

		}

		if (ok) {

			let result = await QUERY(APP.getAppBy(`apps.name='${req.body['apps.name']}'`));

			if (result.length == 0) {

				let app = new APP(req.params.userCode, req.body['apps.name'], req.body['apps.description'], req.body['apps.imageURL'] || undefined, req.body['apps.statusCode'] || undefined , req.body['apps.categoryCode'] || undefined, req.body['apps.visibility'] || undefined);

				result = await QUERY(app.insert());

				if (result.length != 0) {

					result = await QUERY(APP.getAppBy(`apps.name='${req.body['apps.name']}'`));

					app = result[0];

					if (fileName) {

						let newFile = `${app['apps.code']}_${fileName.split('_')[1]}`;

						FS.rename(`/var/www/awesometracker.ddns.net/appImg/${fileName}`, `/var/www/awesometracker.ddns.net/appImg/${newFile}`, async () => {

							result = await QUERY(APP.updateAppBy(`apps.code=${app['apps.code']}`, {'apps.imageURL': `https://awesometracker.ddns.net/appImg/${newFile}`}));

						});

					}

					res.status(200).json({status: 'ok', data: [], msg: 'APP successfully created', doc: 'https://awesometracker.ddns.net/docs'});

				} else {

					error = !error;
					res.status(200).json({status: 'error', data: [], msg: 'Error creating App', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				error = !error;
				res.status(200).json({status: 'error', data: [], msg: 'Error creating App | Duplicate record', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			error = !error;
			res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`, doc: 'https://awesometracker.ddns.net/docs'});

		}

		if (!ok || error) {

			FS.unlink('/var/www/awesometracker.ddns.net/appImg/' + fileName, () => {});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

updateApp = async (req, res) => {

	try {

		let error = false;
		let ok = true;

		if (req.params.userCode) {

			if (req.params.appCode) {

				let result = await QUERY(APP.getAppBy(`apps.userCode=${req.params.userCode},apps.code=${req.params.appCode}`));

				if (result.length == 1) {

					let app = result[0];

					result = await QUERY(APP.getAppBy(`apps.name='${req.body['apps.name']}',apps.code!=${app['apps.code']}`));

					if (result.length == 0) {

						for (param in req.body) {

							if (req.body[param] == '') {

								ok = false;
								message = 'Miss some data';
								break;

							}

							if (/userCode/.test(param)) {

								let result = await QUERY(USER.getUserBy(`users.code=${req.body[param]}`));

								if (result.length == 0) {

									ok = false;
									message = 'Invalid userCode';
									break;

								}

							}

							if (/categoryCode/.test(param)) {

								let result = await QUERY(USER_CATEGORY.getUserCategoryBy(`userCategories.code=${req.body[param]}`));

								if (result.length == 0) {

									ok = false;
									message = 'Invalid categoryCode';
									break;

								}

							}

							if (/status/.test(param)) {

								let result = await QUERY(STATUS.getStatusBy(`status.code=${req.body[param]}`));

								if (result.length == 0) {

									ok = false;
									message = 'Invalid status';
									break;

								}

							}

							if (/imageURL/.test(param)) {

								if (!/awesometracker.ddns.net\/appImg/.test(req.body[param])) {

									let validExtensions = ['jpeg', 'jpg', 'gif', 'png'];
									let extension = req.body[param].split('.')[req.body[param].split('.').length - 1];

									if (!validExtensions.includes(extension)) {

										ok = false;
										message = 'Invalid extension';
										break;

									} else {

										try {

											await REQUEST.get(req.body[param]);

											let fileName = `${app['apps.code']}_${CRYPTO.createHash('md5').update(String(new Date().getTime())).digest("hex")}.${extension}`;

											await REQUEST(req.body[param]).pipe(FS.createWriteStream(`/var/www/awesometracker.ddns.net/appImg/${fileName}`, () => {

												req.body[param] = `https://awesometracker.ddns.net/appImg/${fileName}`;

												FS.readdir('/var/www/awesometracker.ddns.net/appImg/', (err, files) => {

													for (file in files) {

														if (files[file].split('_')[0] == app['apps.code'] && files[file] != req.body[param].split('/')[req.body[param].split('/').length - 1]) {

															FS.unlink('/var/www/awesometracker.ddns.net/userImg/' + files[file], () => {});

														}

													};

												});

											}));

										} catch (e) {

											ok = false;
											message = 'Invalid URL';
											break;

										}

									}

								} else {

									FS.readdir('/var/www/awesometracker.ddns.net/appImg/', (err, files) => {

										for (file in files) {

											if (files[file].split('_')[0] == app['apps.code'] && files[file] != req.body[param].split('/')[req.body[param].split('/').length - 1]) {

												FS.unlink('/var/www/awesometracker.ddns.net/appImg/' + files[file], () => {});

											}

										};

									});

								}

							}

						}

						if (ok) {

							req.body['apps.lastUpdate'] = 'current_timestamp()';

							result = await QUERY(APP.updateAppBy(`apps.userCode=${req.params.userCode},apps.code=${app['apps.code']}`, req.body));

							if (result) {

								res.status(200).json({status: 'ok', data: [], msg: 'App successfully updated', doc: 'https://awesometracker.ddns.net/docs'});

							} else {

								error = !error;
								res.status(200).json({status: 'error', data: [], msg: 'Error updating app', doc: 'https://awesometracker.ddns.net/docs'});

							}

						} else {

							error = !error;
							res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`, doc: 'https://awesometracker.ddns.net/docs'});

						}

					} else {

						error = !error;
						res.status(200).json({status: 'error', data: [], msg: 'Error updating app - Duplicate record', doc: 'https://awesometracker.ddns.net/docs'});

					}

				} else {

					error = !error;
					res.status(200).json({status: 'error', data: [], msg: 'Invalid app and user conbination', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				error = !error;
				res.status(200).json({status: 'error', data: [], msg: 'Appcode missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			error = !error;
			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

		if (!ok || error) {

			FS.unlink('/var/www/awesometracker.ddns.net/appImg/' + fileName, () => {});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

deleteApp = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.appCode) {

				let result = await QUERY(USER.getUserBy(`users.appCode=${req.params.appCode}`));

				let users = result;

				for (user in users) {

					await REQUEST.delete({url: `https://awesometracker.ddns.net/api/v1/users/${users[user]['users.code']}`, json: true, headers: {token: CONFIG.API_TOKEN}});

				}

				result = await QUERY(APP.deleteAppBy(`apps.userCode=${req.params.userCode},apps.code=${req.params.appCode}`));

				if (result.length != 0) {

					FS.readdir('/var/www/awesometracker.ddns.net/appImg/', (err, files) => {

						for (file in files) {

							if (files[file].split('_')[0] == req.params.appCode) {

								FS.unlink('/var/www/awesometracker.ddns.net/appImg/' + files[file], () => {});

							}

						};

					});

					res.status(200).json({status: 'ok', data: [], msg: 'App successfully deleted', doc: 'https://awesometracker.ddns.net/docs'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error deleting app', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'App code missing', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing', doc: 'https://awesometracker.ddns.net/docs'});

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getPosts = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.postCode) {

				let result = await QUERY(POST.getPostBy(`${req.query.where},posts.userCode=${req.params.userCode},posts.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(POST.getPostBy(`${req.query.where},posts.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		} else {

			if (req.params.postCode) {

				let result = await QUERY(POST.getPostBy(`${req.query.where},posts.code=${eq.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(POST.getPostBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getUserCategories = async (req, res) => {

	try {

		if (req.params.userCategoryCode) {

			let result = await QUERY(USER_CATEGORY.getUserCategoryBy(`${req.query.where},userCategories.code=${req.params.userCategoryCode}`, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			let result = await QUERY(USER_CATEGORY.getUserCategoryBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getAppCategories = async (req, res) => {

	try {

		if (req.params.appCategoryCode) {

			let result = await QUERY(APP_CATEGORY.getAppCategoryBy(`${req.query.where},appCategories.code=${req.params.appCategoryCode}`, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			let result = await QUERY(APP_CATEGORY.getAppCategoryBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getPostCategories = async (req, res) => {

	try {

		if (req.params.postCategoryCode) {

			let result = await QUERY(POST_CATEGORY.getPostCategoryBy(`${req.query.where},postCategories.code=${req.params.postCategoryCode}`, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			let result = await QUERY(POST_CATEGORY.getPostCategoryBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getApiCalls = async (req, res) => {

	try {

		if (req.params.userCode && req.params.appCode) {

			let result = await QUERY(APP.getAppBy(`apps.userCode=${req.params.userCode},apps.code=${req.params.appCode}`, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				let app = result[0];

				if (req.params.callCode) {

					let result = await QUERY(CALL.getApiCallBy(`${req.query.where},apiCalls.appCode=${app['apps.code']},apiCalls.code=${req.params.callCode}`, req.query.filter, req.query.orderBy, req.query.order));

					if (result) {

						res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

					}

				} else {

					let result = await QUERY(CALL.getApiCallBy(`${req.query.where},apiCalls.appCode=${app['apps.code']}`, req.query.filter, req.query.orderBy, req.query.order));

					if (result) {

						res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

					}

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Invalid user or app', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			if (req.params.callCode) {

				let result = await QUERY(CALL.getApiCallBy(`${req.query.where},apiCalls.code=${req.params.callCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			} else {

				let result = await QUERY(CALL.getApiCallBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

				}

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

getStatus = async (req, res) => {

	try {

		if (req.params.statusCode) {

			let result = await QUERY(STATUS.getStatusBy(`${req.query.where},status.code=${req.params.statusCode}`, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		} else {

			let result = await QUERY(STATUS.getStatusBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: '', doc: 'https://awesometracker.ddns.net/docs'});

			}

		}

	} catch (e) {

		if (e.sql) {

			res.status(200).json({status: 'error', data: [], msg: `Error on MYSQL syntax check the API doc | ${e.sqlMessage}`, doc: 'https://awesometracker.ddns.net/docs'});

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'General error', doc: 'https://awesometracker.ddns.net/docs'});

		}

	}

}

module.exports = {getInvalidURL, getUsers, addUser, updateUser, deleteUser, getTrackerLogs, addTrackerLog, deleteLog, getApplications, addApplication, updateApplication, deleteApplication, getApps, addApp, updateApp, deleteApp, getPosts, getUserCategories, getAppCategories, getPostCategories, getApiCalls, getStatus}