checkCalls = async (req, res, next) => {

	try {

		QUERY(RECORDER.insertAppCall(req.url, req.method));
		next();

	} catch (e) {

		res.status(200).json({status: 'error', data : e});

	}

};

userConect = (req, res, next) => {

	user = req.session.user || null;
	next();

}

privateRoutes = (req, res, next) => {

	if (!user) {

		res.redirect('/login');

	} else {

		next();

	}

};

adminRoutes = (req, res, next) => {

	if (user.category != CONFIG.ADMIN_CATEGORY) {

		res.redirect('/login');

	} else {

		next();

	}

};

module.exports = {checkCalls, userConect, privateRoutes, adminRoutes};