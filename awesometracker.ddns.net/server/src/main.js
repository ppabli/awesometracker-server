// Modulos especificos
const BODYPARSER = require('body-parser');
const SESSION = require('express-session');
const COOKIEPARSER = require('cookie-parser');
const DOTENV = require ('dotenv');
const HTTP = require ('http');
const HTTPS = require ('https');
const UTIL = require('util');

// Globales
DOTENV.config();
CONFIG = process.env;

REQUEST = require('request-promise')
EXPRESS = require('express');
NODEMAILER = require('nodemailer');
ADMZIP = require('adm-zip');
FS = require('fs');
PATH = require('path');

PASSWORD = require('./lib/password');
FUNCTIONS = require('./lib/functions');

USER = require('./models/user.model');
APP = require('./models/app.model');
APPLICATION = require('./models/application.model');
TRACKERLOG = require('./models/trackerLog.model');
RECORDER = require('./models/recorder.model');

DB = require('./db/database')

QUERY = UTIL.promisify(DB.query).bind(DB);

API_MIDDLEWARES = require('./middlewares/api.middlewares')
APP_MIDDLEWARES = require('./middlewares/app.middlewares')
API_CONTROLLER = require('./controllers/api.controller');
APP_CONTROLLER = require('./controllers/app.controller');

/* const privateKey = FS.readFileSync(`${config.PRIVATE_KEY}`, 'utf8');
const certificate = FS.readFileSync(`${config.CERT}`, 'utf8');
const ca = FS.readFileSync(`${config.CA}`, 'utf8');

const CREDENTIALS = {

	key: privateKey,
	cert: certificate,
	ca: ca

}; */

const APIROUTES = require('./routes/api.route');
const APPROUTES = require('./routes/app.route');

const SERVER = EXPRESS();

SERVER.use(EXPRESS.static('/var/www/awesometracker.ddns.net/client/dist'));

SERVER.use(BODYPARSER.json());
SERVER.use(BODYPARSER.urlencoded({extended: true}));
SERVER.use(COOKIEPARSER());
SERVER.use(SESSION({

	secret: CONFIG.COOKIE_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: {

		path: '/',
		httpOnly: true,
		maxAge: 1000 * 60 * 30,
		sameSite: true

	},

	rolling: true

}));

SERVER.use('/api/v1/', APIROUTES);
SERVER.use('/', APPROUTES);

const HTTPSERVER = HTTP.createServer(SERVER);
HTTPSERVER.listen(CONFIG.SERVER_HTTP_PORT, () => {

	console.log(`Servidor http funcionando en puerto ${CONFIG.SERVER_HTTP_PORT}`);

});

//TODO faltan agregar las credenciales
/* const HTTPSSERVER = HTTPS.createServer(CREDENTIALS, SERVER);
HTTPSSERVER.listen(config.SERVER_HTTPS_PORT, () => {

	console.log(`Servidor https funcionando en puerto ${config.PUERTO_WEB_HTTPS}`);

}); */