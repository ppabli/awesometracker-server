const ROUTER = EXPRESS.Router();

ROUTER.use([APP_MIDDLEWARES.checkCalls, APP_MIDDLEWARES.userConect])

/* Rutas publicas */

/* Rutas para direccionar */
ROUTER.get('/', APP_CONTROLLER.index);
ROUTER.get('/login', APP_CONTROLLER.index);
ROUTER.get('/registry', APP_CONTROLLER.index);
ROUTER.get('/forgotPassword', APP_CONTROLLER.index);
ROUTER.get('/recoverAccount', APP_CONTROLLER.index);

/* Rutas que relizan acciones */
ROUTER.post('/access', APP_CONTROLLER.access);
ROUTER.post('/createAccount', APP_CONTROLLER.createAccount);
ROUTER.post('/addLog', APP_CONTROLLER.addLog);
ROUTER.post('/forgotPassword', APP_CONTROLLER.forgotPassword);
ROUTER.post('/recoverAccount', APP_CONTROLLER.recoverAccount);

/* Rutas privadas */

ROUTER.use([APP_MIDDLEWARES.checkCalls, APP_MIDDLEWARES.userConect, APP_MIDDLEWARES.privateRoutes]);

/* Ruta descarga */

ROUTER.get('/dashboard/download/:downloadCode', APP_CONTROLLER.download);

/* Rutas para direccionar */
ROUTER.get('/dashboard', APP_CONTROLLER.index);
ROUTER.get('/dashboard/metrics', APP_CONTROLLER.index);
ROUTER.get('/dashboard/summary', APP_CONTROLLER.index);
ROUTER.get('/dashboard/downloads', APP_CONTROLLER.index);
ROUTER.get('/dashboard/logs', APP_CONTROLLER.index);
ROUTER.get('/dashboard/applications', APP_CONTROLLER.index);
ROUTER.get('/dashboard/profile/:userCcode?', APP_CONTROLLER.index);

ROUTER.get('/dashboard/admin/users', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);
ROUTER.get('/dashboard/admin/logs', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);
ROUTER.get('/dashboard/admin/applications', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);
ROUTER.get('/dashboard/admin/apps', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);


/* Rutas que relizan acciones */
ROUTER.get('/logout', APP_CONTROLLER.logout);

ROUTER.get('/dashboard/data/:operationCode', APP_CONTROLLER.data);

ROUTER.post('/dashboard/deleteLog', APP_CONTROLLER.deleteLog);
ROUTER.post('/dashboard/addApplication', APP_CONTROLLER.addApplication);
ROUTER.post('/dashboard/updateApplication', APP_CONTROLLER.updateApplication);
ROUTER.post('/dashboard/deleteApplication', APP_CONTROLLER.deleteApplication);

module.exports = ROUTER;