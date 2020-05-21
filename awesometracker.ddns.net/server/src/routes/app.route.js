const ROUTER = EXPRESS.Router();

ROUTER.use([APP_MIDDLEWARES.redirect, APP_MIDDLEWARES.checkCalls, APP_MIDDLEWARES.userConect])

ROUTER.get('/', APP_CONTROLLER.index);
ROUTER.get('/login', APP_CONTROLLER.index);
ROUTER.get('/registry', APP_CONTROLLER.index);
ROUTER.get('/forgotPassword', APP_CONTROLLER.index);
ROUTER.get('/recoverUser', APP_CONTROLLER.index);

ROUTER.get('/docs', APP_CONTROLLER.index);
ROUTER.get('/docs/api', APP_CONTROLLER.index);
ROUTER.get('/docs/terms', APP_CONTROLLER.index);
ROUTER.get('docs/privacy', APP_CONTROLLER.index);

ROUTER.get('/posts', APP_CONTROLLER.getIndexPosts);

ROUTER.post('/access', APP_CONTROLLER.access);
ROUTER.post('/addUser', APP_CONTROLLER.addUser);
ROUTER.post('/addLog', APP_CONTROLLER.addLog);
ROUTER.post('/forgotPassword', APP_CONTROLLER.forgotPassword);
ROUTER.post('/recoverUser', APP_CONTROLLER.recoverUser);

ROUTER.use([APP_MIDDLEWARES.redirect, APP_MIDDLEWARES.checkCalls, APP_MIDDLEWARES.userConect, APP_MIDDLEWARES.privateRoutes]);

ROUTER.get('/dashboard', APP_CONTROLLER.index);
ROUTER.get('/dashboard/downloads', APP_CONTROLLER.index);
ROUTER.get('/dashboard/logout', APP_CONTROLLER.logout);

ROUTER.get('/dashboard/posts', APP_CONTROLLER.index);
ROUTER.get('/dashboard/posts/:postCode', APP_CONTROLLER.index);
ROUTER.get('/dashboard/posts/summary', APP_CONTROLLER.index);

ROUTER.get('/dashboard/data/:operationCode', APP_CONTROLLER.data);

ROUTER.get('/dashboard/metrics', APP_CONTROLLER.index);
ROUTER.get('/dashboard/metrics/summary', APP_CONTROLLER.index);
ROUTER.get('/dashboard/metrics/logs', APP_CONTROLLER.index);
ROUTER.get('/dashboard/metrics/applications', APP_CONTROLLER.index);

ROUTER.get('/dashboard/apps/', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/:appCode/', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/summary', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/users', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/addApp', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/applications', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/:appCode/editApp', APP_CONTROLLER.index);
ROUTER.get('/dashboard/apps/:appCode/upgradeApp', APP_CONTROLLER.index);

ROUTER.get('/dashboard/user/:userCode?', APP_CONTROLLER.index);
ROUTER.get('/dashboard/user/:userCode?/editUser', APP_CONTROLLER.index);
ROUTER.get('/dashboard/user/:userCode?/upgradeUser', APP_CONTROLLER.index);

ROUTER.post('/dashboard/user/:userCode/upgradeUser/createUserTransaction', APP_CONTROLLER.createUserTransaction);
ROUTER.post('/dashboard/user/:userCode/upgradeUser/captureUserTransaction', APP_CONTROLLER.captureUserTransaction);

ROUTER.post('/dashboard/user/:userCode/apps/:appCode/upgradeApp/createAppTransaction', APP_CONTROLLER.createAppTransaction);
ROUTER.post('/dashboard/user/:userCode/apps/:appCode/upgradeApp/captureAppTransaction', APP_CONTROLLER.captureAppTransaction);

ROUTER.get('/dashboard/user/:userCode?/upgradeUser', APP_CONTROLLER.index);
ROUTER.get('/dashboard/user/addUser', APP_CONTROLLER.index);

ROUTER.get('/dashboard/admin/users', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);
ROUTER.get('/dashboard/admin/logs', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);
ROUTER.get('/dashboard/admin/applications', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);
ROUTER.get('/dashboard/admin/apps', [APP_MIDDLEWARES.adminRoutes], APP_CONTROLLER.index);

ROUTER.post('/dashboard/deleteLog', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.deleteLog);

ROUTER.post('/dashboard/addApplication', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.addApplication);
ROUTER.post('/dashboard/updateApplication', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.updateApplication);
ROUTER.post('/dashboard/deleteApplication', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.deleteApplication);

ROUTER.post('/dashboard/addUser', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.addUser);
ROUTER.post('/dashboard/updateUser', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.updateUser);
ROUTER.post('/dashboard/deleteUser', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.deleteUser);

ROUTER.post('/dashboard/addApp', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.addApp);
ROUTER.post('/dashboard/updateApp', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.updateApp);
ROUTER.post('/dashboard/deleteApp', [APP_MIDDLEWARES.checkPermits], APP_CONTROLLER.deleteApp);

module.exports = ROUTER;