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

REQUEST = require('request-promise');
REQUEST2 = require('request');
EXPRESS = require('express');
NODEMAILER = require('nodemailer');
FORMIDABLE = require('formidable');
FS = require('fs');
CRYPTO = require('crypto');
PAYPAL = require('@paypal/checkout-server-sdk');

FUNCTIONS = require('./lib/functions');
PASSWORD = require('./lib/password');
PAYPAL_CLIENT = require('./lib/paypal');
DB = require('./lib/database')

USER = require('./models/user.model');
APP = require('./models/app.model');
APPLICATION = require('./models/application.model');
TRACKERLOG = require('./models/trackerLog.model');
POST = require('./models/post.model');
USER_CATEGORY = require('./models/userCategory.model');
APP_CATEGORY = require('./models/appCategory.model');
POST_CATEGORY = require('./models/postCategory.model');
CALL = require('./models/call.model');
STATUS = require('./models/status.model');


QUERY = UTIL.promisify(DB.query).bind(DB);

API_MIDDLEWARES = require('./middlewares/api.middlewares')
APP_MIDDLEWARES = require('./middlewares/app.middlewares')
API_CONTROLLER = require('./controllers/api.controller');
APP_CONTROLLER = require('./controllers/app.controller');

const privateKey = FS.readFileSync(`${CONFIG.KEY}`, 'utf8');
const certificate = FS.readFileSync(`${CONFIG.CERT}`, 'utf8');
const ca = FS.readFileSync(`${CONFIG.CA}`, 'utf8');

const CREDENTIALS = {

	key: privateKey,
	cert: certificate,
	ca: ca

};

const APIROUTES = require('./routes/api.route');
const APPROUTES = require('./routes/app.route');

const SERVER = EXPRESS();

SERVER.set('trust proxy', true)

SERVER.use('/js', EXPRESS.static('/var/www/awesometracker.ddns.net/client/dist/js'));
SERVER.use('/css', EXPRESS.static('/var/www/awesometracker.ddns.net/client/dist/css'));
SERVER.use('/img', EXPRESS.static('/var/www/awesometracker.ddns.net/client/dist/img'));
SERVER.use('/favicon.ico', EXPRESS.static('/var/www/awesometracker.ddns.net/client/dist/favicon.ico'));

SERVER.use('/userImg', EXPRESS.static('/var/www/awesometracker.ddns.net/userImg'));
SERVER.use('/appImg', EXPRESS.static('/var/www/awesometracker.ddns.net/appImg'));

SERVER.use(BODYPARSER.json());
SERVER.use(BODYPARSER.urlencoded({extended: true}));
SERVER.use(COOKIEPARSER());
SERVER.use(SESSION({

	secret: CONFIG.COOKIE_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {

		path: '/',
		httpOnly: true,
		maxAge: 1000 * 60 * 60,
		sameSite: true,
		secure: true

	},

	rolling: true

}));

SERVER.use('/api/v1/', APIROUTES);
SERVER.use('', APPROUTES);

const HTTPSERVER = HTTP.createServer(SERVER);
HTTPSERVER.listen(CONFIG.SERVER_HTTP_PORT, () => {

	console.log(`Servidor http funcionando en puerto ${CONFIG.SERVER_HTTP_PORT}`);

});

const HTTPSSERVER = HTTPS.createServer(CREDENTIALS, SERVER);
HTTPSSERVER.listen(CONFIG.SERVER_HTTPS_PORT, () => {

	console.log(`Servidor https funcionando en puerto ${CONFIG.SERVER_HTTPS_PORT}`);

});