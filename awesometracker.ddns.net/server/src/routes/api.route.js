const ROUTER = EXPRESS.Router();

ROUTER.use(API_MIDDLEWARES.redirect, API_MIDDLEWARES.escapeHTML, API_MIDDLEWARES.checkToken, API_MIDDLEWARES.checkStatus, API_MIDDLEWARES.checkCalls);

ROUTER.get('/users/:userCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getUsers);
ROUTER.get('/trackerLogs/:trackerLogCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getTrackerLogs);
ROUTER.get('/applications/:applicationCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApplications);
ROUTER.get('/apps/:appCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApps);
ROUTER.get('/posts/:postCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getPosts);
ROUTER.get('/userCategories/:userCategoryCode?', API_CONTROLLER.getUserCategories);
ROUTER.get('/appCategories/:appCategoryCode?', API_CONTROLLER.getAppCategories);
ROUTER.get('/postCategories/:postCategoryCode?', API_CONTROLLER.getPostCategories);
ROUTER.get('/apiCalls/:callCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApiCalls);
ROUTER.get('/status/:statusCode?', API_CONTROLLER.getStatus);

ROUTER.get('/users/:userCode/trackerLogs/:trackerLogCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getTrackerLogs);
ROUTER.get('/users/:userCode/applications/:applicationCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApplications);
ROUTER.get('/users/:userCode/apps/:appCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApps);
ROUTER.get('/users/:userCode/posts/:postCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getPosts);
ROUTER.get('/users/:userCode/apps/:appCode/apiCalls/:callCode?', [API_MIDDLEWARES.filter], API_CONTROLLER.getApiCalls);

ROUTER.get('*', API_CONTROLLER.getInvalidURL);

ROUTER.post('/users', API_CONTROLLER.addUser);
ROUTER.post('/users/:userCode/trackerLogs', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.addTrackerLog);
ROUTER.post('/users/:userCode/applications', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.addApplication);
ROUTER.post('/users/:userCode/apps', [API_MIDDLEWARES.checkPermits, API_MIDDLEWARES.checkApp], API_CONTROLLER.addApp);

ROUTER.post('*', API_CONTROLLER.getInvalidURL);

ROUTER.delete('/users/:userCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteUser);
ROUTER.delete('/users/:userCode/trackerLogs/:trackerLogCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteLog);
ROUTER.delete('/users/:userCode/applications/:applicationCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteApplication);
ROUTER.delete('/users/:userCode/apps/:appCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.deleteApp);

ROUTER.delete('*', API_CONTROLLER.getInvalidURL);

ROUTER.patch('/users/:userCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.updateUser);
ROUTER.patch('/users/:userCode/applications/:applicationCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.updateApplication);
ROUTER.patch('/users/:userCode/apps/:appCode', [API_MIDDLEWARES.checkPermits], API_CONTROLLER.updateApp);

ROUTER.patch('*', API_CONTROLLER.getInvalidURL);

module.exports = ROUTER;