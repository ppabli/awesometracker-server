/* ------------------------------------------ Users ------------------------------------------ */
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

				res.status(200).json({status: 'ok', data: result, msg: ''});

			}

		} else {

			let result = await QUERY(USER.getUserBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

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

		if (res.locals.application.code && req.body['users.user'] && req.body['users.user'] != '' && req.body['users.password'] && req.body['users.password'] != '' && req.body['users.email'] && req.body['users.email'] != '' && req.body['users.name'] && req.body['users.name'] != '' && req.body['users.surname'] && req.body['users.surname'] != '' && req.body['users.birthDate'] && req.body['users.birthDate'] != '') {

			if (/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(req.body['users.password']) && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body['users.email']) && ((new Date() - new Date(req.body['users.birthDate'])) >= 0)) {

				let result = await QUERY(USER.checkUser(req.body.user, req.body.email, req.body.name, req.body.surname));

				if (result.length == 0) {

					let user = new USER(res.locals.application.code, req.body['users.user'], req.body['users.password'], req.body['users.email'], req.body['users.name'], req.body['users.surname'], req.body['users.birthDate']);

					result = await QUERY(user.insert());

					if (result.length != 0) {

						res.status(200).json({status: 'ok', data: [], msg: 'User successfully created'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error creating user'});

					}

				} else {

					res.status(200).json({status: 'error', data: [], msg: 'Error creating user | Duplicate record'});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Invalid data'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Data missing'});

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

				result = await QUERY(USER.getUserBy(`users.code=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.getUserBy(`users.email='${req.params.userCode}'`, req.query.filter, req.query.orderBy, req.query.order));

			} else {

				result = await QUERY(USER.getUserBy(`users.user='${req.params.userCode}'`, req.query.filter, req.query.orderBy, req.query.order));

			}

			let user = result[0];

			result = await QUERY(USER.checkUserException((req.body.user || user['users.user']), (req.body.email || user['users.email']), (req.body.name || user['users.name']), (req.body.surname || user['users.surname']), user['users.code']));

			if (result.length == 0) {

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

						let result = await QUERY(APP.getAppBy(`${req.query.where},apps.code=${req.body[param]}`, req.query.filter, req.query.orderBy, req.query.order));

						if (result.length == 0) {

							ok = false;
							message = 'Invalid appCode';
							break;

						}

					}

					if (/categoryCode/.test(param)) {

						let result = await QUERY(USERCATEGORY.getUserCategoryBy(`${req.query.where},userCategories.code=${req.body[param]}`, req.query.filter, req.query.orderBy, req.query.order));

						if (result.length == 0) {

							ok = false;
							message = 'Invalid categoryCode';
							break;

						}

					}

				}

				if (ok) {

					req.body['users.lastUpdate'] = 'current_timestamp()';

					result = await QUERY(USER.updateUserBy(`users.code=${user['users.code']}`, req.body));

					if (result) {

						res.status(200).json({status: 'ok', data: [], msg: 'User successfully updated'});

					} else {

						res.status(200).json({status: 'error', data: [], msg: 'Error updating user'});

					}

				} else {

					res.status(200).json({status: 'error', data: [], msg: `Invalid data provided | ${message}`});

				}

			} else {

				res.status(200).json({status: 'error', data: [], msg: 'Error updating user - Duplicate record'});

			}

		} else {

			res.status(200).json({status: 'error', data: [], msg: 'Usercode missing'});

		}

	} catch (e) {

		console.log(e);
		res.status(200).json({status: 'error', data: e, msg: 'General error'});

	}

}

deleteUser = async (req, res) => {

	try {

		let result = undefined;

		if (req.params.userCode) {

			if (!isNaN(req.params.userCode)) {

				result = await QUERY(USER.deleteUserBy(`users.code=${req.params.userCode}`));

			} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.params.userCode)) {

				result = await QUERY(USER.deleteUserBy(`users.email='${req.params.userCode}'`));

			} else {

				result = await QUERY(USER.deleteUserBy(`users.user='${req.params.userCode}'`));

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

/* ------------------------------------------ LOGS ------------------------------------------ */
getTrackerLogs = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(`${req.query.where},trackerLogs.userCode=${req.params.userCode},trackerLogs.code=${req.params.trackerLogCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(`${req.query.where},trackerLogs.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			}

		} else {

			if (req.params.trackerLogCode) {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(`${req.query.where},trackerLogs.code=${req.params.trackerLogCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(TRACKERLOG.getTrackerLogBy(req.body.where, req.query.filter, req.query.orderBy, req.query.order));

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

			let result = await QUERY(TRACKERLOG.deleteTrackerLogBy(`trackerLogs.code=${req.params.trackerLogCode}`));

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

				let result = await QUERY(APPLICATION.getApplicationBy(`${req.query.where},applications.userCode=${req.params.userCode},applications.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(APPLICATION.getApplicationBy(`${req.query.where},applications.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			}

		} else {

			if (req.params.applicationCode) {

				let result = await QUERY(APPLICATION.getApplicationBy(`${req.query.where},applications.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			} else {

				let result = await QUERY(APPLICATION.getApplicationBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

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

				let exists = await QUERY(APPLICATION.getApplicationBy(`applications.userCode=${req.params.userCode},applications.app='${req.body.app}'`));

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

					req.body['applications.lastUpdate'] = 'current_timestamp()';

					result = await QUERY(APPLICATION.updateApplicationBy(`applications.code=${req.params.applicationCode}`, req.body));

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

				let result = await QUERY(APPLICATION.deleteApplicationBy(`applications.code=${req.params.applicationCode}`));

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

				let result = await QUERY(APP.getAppBy(`${req.query.where},apps.userCode=${req.params.userCode},appss.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(APP.getAppBy(`${req.query.where},apps.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			}

		} else {

			if (req.params.applicationCode) {

				let result = await QUERY(APP.getAppBy(`${req.query.where},appss.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			} else {

				let result = await QUERY(APP.getAppBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data: result, msg: ''});

				}

			}

		}

	} catch (e) {

		res.status(200).json({status : 'error', data : e, msg: 'General error'});

	}

}

/* Posts */
getPosts = async (req, res) => {

	try {

		if (req.params.userCode) {

			if (req.params.postCode) {

				let result = await QUERY(POST.getPostBy(`${req.query.where},posts.userCode=${req.params.userCode},posts.code=${req.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data : result, msg: ''});

				}

			} else {

				let result = await QUERY(POST.getPostBy(`${req.query.where},posts.userCode=${req.params.userCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			}

		} else {

			if (req.params.postCode) {

				let result = await QUERY(POST.getPostBy(`${req.query.where},posts.code=${eq.params.applicationCode}`, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status: 'ok', data: result, msg: ''});

				}

			} else {

				let result = await QUERY(POST.getPostBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

				if (result) {

					res.status(200).json({status : 'ok', data: result, msg: ''});

				}

			}

		}

	} catch (e) {

		res.status(200).json({status : 'error', data : e, msg: 'General error'});

	}

}

getUserCategories = async (req, res) => {

	try {

		if (req.params.userCategoryCode) {

			let result = await QUERY(USERCATEGORY.getUserCategoryBy(`${req.query.where},userCategories.code=${req.params.userCategoryCode}`, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status : 'ok', data : result, msg: ''});

			}

		} else {

			let result = await QUERY(USERCATEGORY.getUserCategoryBy(req.query.where, req.query.filter, req.query.orderBy, req.query.order));

			if (result) {

				res.status(200).json({status: 'ok', data: result, msg: ''});

			}

		}

	} catch (e) {

		res.status(200).json({status : 'error', data : e, msg: 'General error'});

	}

}

module.exports = {getUsers, addUser, updateUser, deleteUser, getTrackerLogs, addTrackerLog, deleteLog, getApplications, addApplication, updateApplication, deleteApplication, getApps, getPosts, getUserCategories}