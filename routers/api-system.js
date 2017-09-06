var checksCtrlr = require('bolt-internal-checks');
var express = require('express');

var apiSystemCtrlr = require('../controllers/api-system');

var router = express.Router();

router.get('/', apiSystemCtrlr.get);

//TODO: GET: /config //returns the config object (with allowed/public/visible/safe properties)
//TODO: GET: /config/:property //returns the value of a property of the config object (as long as that property is allowed/public/visible/safe to view)

//returns an array of all endpoints, and some extra info
router.get('/help', apiSystemCtrlr.getHelp);

//TODO: GET: /help/:endpoint //returns the description of an endpoint
//TODO: GET: /help/:endpoint/:version //returns the description of a version of an endpoint

//TODO: consider adding checksCtrlr.forSystemApp

router.post('/exit', checksCtrlr.forAdminRight, apiSystemCtrlr.postExit);
router.post('/exit/:code', checksCtrlr.forAdminRight, apiSystemCtrlr.postExitCode);

router.post('/reset', checksCtrlr.forAdminRight, apiSystemCtrlr.postReset);
router.post('/reset/:collection', checksCtrlr.forAdminRight, apiSystemCtrlr.postResetCollection);

router.post('/sync', checksCtrlr.forAdminRight, apiSystemCtrlr.postSync);
router.post('/sync-bolt', checksCtrlr.forAdminRight, apiSystemCtrlr.postSyncBolt);
router.post('/sync-db', checksCtrlr.forAdminRight, apiSystemCtrlr.postSyncDB);

router.post('/push', checksCtrlr.forAdminRight, apiSystemCtrlr.postPush);
router.post('/push-bolt', checksCtrlr.forAdminRight, apiSystemCtrlr.postPushBolt);
router.post('/push-db', checksCtrlr.forAdminRight, apiSystemCtrlr.postPushDB);

router.post('/pull', checksCtrlr.forAdminRight, apiSystemCtrlr.postPull);
router.post('/pull-bolt', checksCtrlr.forAdminRight, apiSystemCtrlr.postPullBolt);
router.post('/pull-db', checksCtrlr.forAdminRight, apiSystemCtrlr.postPullDB);

module.exports = router;