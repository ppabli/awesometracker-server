/* ------------------------------------------ Users ------------------------------------------ */
getUsers = async (req, res) => {

	try {

		if (req.params.userCode) {

			let result = undefined;

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.getUserBy({'users.code': req.params.userCode}, req.query.filter, req.query.orderBy, req.query.order));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.getUserBy({'users.email': req.params.userCode}, req.query.filter, req.query.orderBy, req.query.order));

			} else {

				result = await QUERY(USER.getUserBy({'users.user': req.params.userCode}, req.query.filter, req.query.orderBy, req.query.order));

			}

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: ''});

			}

		} else {

			let result = await QUERY(USER.getUserBy({}, req.query.filter, req.query.orderBy, req.query.order),);

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: ''});

			}

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

};

addUser = async (req, res) => {

	try {

		if (res.locals.application.code != '' && req.body.user != '' && req.body.password != '' && (/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(req.body.password)) && req.body.email != '' && (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) && req.body.name != '' && req.body.surname != '' && req.body.birthDate != '') {

			let result = await QUERY(USER.checkUser(req.body.user, req.body.email, req.body.name, req.body.surname));

			if (result.length == 0) {

				let user = new USER(res.locals.application.code, req.body.user, req.body.password, req.body.email, req.body.name, req.body.surname, req.body.birthDate);

				result = await QUERY(user.insert());

				if (result.length != 0) {

					res.status(200).json({status: 'ok', data: [], msg: 'User successfully created'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error creating user'})

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error creating user | Duplicate record'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Data missing'})

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

};

updateUser = async (req, res) => {

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

			let user = result[0];

			result = await QUERY(USER.checkUserException((req.body.user || user['users.user']), (req.body.email || user['users.email']), (req.body.name || user['users.name']), (req.body.surname || user['users.surname']), user['users.appCode']));

			if (result.length != 0) {

				// TODO Revisar si los campos proporcinados como contrasena y email son correctos con regex
				result = await QUERY(USER.updateUserBy({code: user['users.code']}, req.body));

				if (result) {

					res.status(200).json({status: 'ok', data: [], msg: 'User successfully updated'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error updating user'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error updating user - Duplicate record'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteUser = async (req, res) => {

	try {

		let result = undefined;

		if (req.params.userCode) {

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.deleteUserBy({code: req.params.userCode}));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.deleteUserBy({email: req.params.userCode}));

			} else {

				result = await QUERY(USER.deleteUserBy({user: req.params.userCode}));

			}

			if (result.length != 0) {

				res.status(200).json({status: 'ok', data: [], msg: 'User successfully deleted'});

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error deleting user'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}
/* ------------------------------------------ x ------------------------------------------ */

/* TODO Ajustar las repsuestas al nuevo estandar como en la parte de usuario */
/* ------------------------------------------ LOGS ------------------------------------------ */
getTrackerLogs = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy({'trackerLogs.userCode': req.params.userCode, 'trackerLogs.code': req.params.trackerLogCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy({'trackerLogs.userCode': req.params.userCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			}

		} else {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy({'trackerLogs.code': req.params.trackerLogCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy({}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			}

		}

	} catch (e) {

		res.status(200).json({status : 'error', data : e, msg: 'Error general'});

	}

}

addTrackerLog = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.body.app && req.body.start && req.body.stop) {

				let result= await QUERY(APPLICATION.getApplicationBy({'applications.userCode': req.params.userCode, 'applications.app': req.body.app}));

				if (result.length == 0) {

					let newApplication = new APPLICATION(req.params.userCode, 'unknown', req.body.app);
					QUERY(newApplication.insert());
					result= await QUERY(APPLICATION.getApplicationBy({'applications.userCode': req.params.userCode, 'applications.app': req.body.app}));

				}

				let newTrackerLog = new TRACKERLOG(req.params.userCode, result[0]['applications.code'], req.body.start, req.body.stop);

				result = await QUERY(newTrackerLog.insert());

				if (result.length != 0) {

					res.status(200).json({status: 'ok', data: [], msg: 'Log successfully created'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error creating the log'})

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Data missing'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'User code missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

};

deleteLog = async (req, res) => {

	try {

		if (req.params.userCode) {

			let result = await QUERY(TRACKERLOG.deleteTrackerLogBy({code: req.params.trackerLogCode}));

			if (result.length != 0) {

				res.status(200).json({status: 'ok', data: [], msg: 'Log successfully deleted'});

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error deleting log'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}
/* ------------------------------------------ x ------------------------------------------ */

/* ------------------------------------------ Aplications and Categories ------------------------------------------ */
getApplications = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.getApplicationBy({'applications.userCode': req.params.userCode, 'applications.code': req.params.applicationCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(APPLICATION.getApplicationBy({'applications.userCode': req.params.userCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			}

		} else {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.getApplicationBy({'applications.code': req.params.applicationCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			} else {

				let result = await QUERY(APPLICATION.getApplicationBy({}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data: result, msg: ''});

				}

			}

		}

	} catch (e) {

		res.status(200).json({status : 'error', data : e, msg: 'General error'});

	}

}

addApplication = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.body.category && req.body.app) {

				let exists = await QUERY(APPLICATION.getApplicationBy({userCode: req.params.userCode, app: req.body.app}));

				if (exists.length == 0) {

					let newApplication = new APPLICATION(req.params.userCode, req.body.category, req.body.app);

					let result = await QUERY(newApplication.insert());

					if (result.length != 0) {

						res.status(200).json({status: 'ok', data: [], msg: 'Aplication successfully created'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error creating aplication'})

					}

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error creating aplication - Duplicate record'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Data missing'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

updateApplication = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.checkApplicationException(req.params.applicationCode, req.params.userCode, req.body.app));

				if (result.length == 0) {

					result = await QUERY(APPLICATION.updateApplicationBy({code: req.params.applicationCode}, req.body));

					if (result.length != 0) {

						res.status(200).json({status: 'ok', data: [], msg: 'Application successfully updated'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error updating application'});

					}

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error updating application | Duplicated application'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Application code missing'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteApplication = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.deleteApplicationBy({code: req.params.applicationCode}));

				if (result.length != 0) {

					res.status(200).json({status: 'ok', data: [], msg: 'Application successfully deleted'});

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error deleting application'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Application code missing'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}
/* ------------------------------------------ x ------------------------------------------ */

/* ------------------------------------------ Apps ------------------------------------------ */
getApps = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.applicationCode) {

				let result = await QUERY(APP.getAppBy({'apps.userCode': req.params.userCode, 'appss.code': req.params.applicationCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(APP.getAppBy({'apps.userCode': req.params.userCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			}

		} else {

			if (req.params.applicationCode) {

				let result = await QUERY(APP.getAppBy({'appss.code': req.params.applicationCode}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			} else {

				let result = await QUERY(APP.getAppBy({}, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data: result, msg: ''});

				}

			}

		}

	} catch (e) {

		res.status(200).json({status : 'error', data : e, msg: 'General error'});

	}

}
module.exports = {getUsers, addUser, updateUser, deleteUser, getTrackerLogs, addTrackerLog, deleteLog, getApplications, addApplication, updateApplication, deleteApplication, getApps}