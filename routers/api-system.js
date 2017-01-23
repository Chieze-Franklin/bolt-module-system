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

router.post('/exit', checksCtrlr.forAdminRight, apiSystemCtrlr.postExit);
router.post('/exit/:code', checksCtrlr.forAdminRight, apiSystemCtrlr.postExitCode);

router.post('/reset', checksCtrlr.forUserPermToReset, apiSystemCtrlr.postReset);
router.post('/reset/:collection', checksCtrlr.forUserPermToReset, apiSystemCtrlr.postResetCollection);

module.exports = router;