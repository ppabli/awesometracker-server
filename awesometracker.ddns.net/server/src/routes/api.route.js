const ROUTER = EXPRESS.Router();

ROUTER.use(API_MIDDLEWARES.escapeHTML, API_MIDDLEWARES.checkToken, API_MIDDLEWARES.checkCalls);

ROUTER.get('/users/:userCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getUsers);
ROUTER.get('/trackerLogs/:trackerLogCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getTrackerLogs);
ROUTER.get('/applications/:applicationCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApplications);
ROUTER.get('/apps/:appCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApps);
ROUTER.get('/posts/:postCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getPosts);
ROUTER.get('/userCategories/:userCategoryCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getUserCategories);

ROUTER.get('/users/:userCode/trackerLogs/:trackerLogCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getTrackerLogs);
ROUTER.get('/users/:userCode/applications/:applicationCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApplications);
ROUTER.get('/users/:userCode/apps/:appCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApps);
ROUTER.get('/users/:userCode/posts/:postCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getPosts);

ROUTER.post('/users', API_CONTROLLER.addUser);
ROUTER.post('/users/:userCode?/trackerLogs', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.addTrackerLog);
ROUTER.post('/users/:userCode?/applications', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.addApplication);

ROUTER.delete('/users/:userCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteUser);
ROUTER.delete('/users/:userCode/trackerLogs/:trackerLogCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteLog);
ROUTER.delete('/users/:userCode/applications/:applicationCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteApplication);

ROUTER.patch('/users/:userCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.updateUser);
ROUTER.patch('/users/:userCode/applications/:applicationCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.updateApplication);

module.exports = ROUTER;