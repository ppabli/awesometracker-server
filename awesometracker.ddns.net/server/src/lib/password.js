const bcrypt = require('bcryptjs');

encryptPassword = (password) => {

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;

};

comparePasswords = (password, savedPassword) => {

	try {

		return bcrypt.compareSync(password, savedPassword);

	} catch(err) {

		console.log(err);

	}

};

module.exports = {encryptPassword, comparePasswords};