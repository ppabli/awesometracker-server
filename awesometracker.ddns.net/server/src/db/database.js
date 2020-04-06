const MYSQL = require('mysql');

const POOL = MYSQL.createPool({

	host: CONFIG.DB_HOST,
	user: CONFIG.DB_USER,
	password: CONFIG.DB_PASSWORD,
	database: CONFIG.DB_DB

});

POOL.getConnection((err, connection) => {

	if (err) {

		throw err;

	}

	if (connection) {

		connection.release();

	}

	console.log('Servidor web conectado a la base de datos');

});

module.exports = POOL;