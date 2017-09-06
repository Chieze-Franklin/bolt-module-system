var config = require("bolt-internal-config");
var getRoutes = require("bolt-internal-get-routes");
var utils = require("bolt-internal-utils");
var models = require("bolt-internal-models");
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var Git = require('nodegit');
var open = Git.Repository.open;

function pullBolt(repositoryPath, remoteName, branch, callback) {
	var repository;
    var remoteBranch = remoteName + '/' + branch;
    open(repositoryPath)
        .then(function (_repository) {
            repository = _repository;
            return repository.fetch(remoteName);
        }, callback)
        .then(function () {
            return repository.mergeBranches(branch, remoteBranch);
        }, callback)
        .then(function (oid) {
            callback(null, oid);
        }, callback);
}

module.exports = {
	get: function(request, response){
		response.redirect('/api/help');
	},
	getHelp: function(request, response){
		var system = {
			name: config.getName(),
			friendlyName: config.getFriendlyName(),
			version: config.getVersion(),
			minimumVersion: config.getMinimumVersion(),
			friendlyVersion: config.getFriendlyVersion()
		};

		var summary = getRoutes.summary(request.app);
		system.paths = summary.paths;
		system.routes = summary.routes;
		system.lines = summary.lines;
		//system.treeView = getRoutes.treeView(request.app);

		response.send(utils.Misc.createResponse(system));
	},
	postExit: function(request, response){
		utils.Events.fire('system-exiting', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//TODO: it may be possible for some apps to hold something like a lock, preventing the system from shutting down
			//wait a few seconds before shutting down
			setTimeout(function(){
				process.exit();
			}, 4000);
		});
	},
	postExitCode: function(request, response){
		var code = parseInt(utils.String.trim(request.params.code), 10);
		utils.Events.fire('system-exiting', { body: { code: code } }, request.bolt.token, function(eventError, eventResponse){
			//TODO: it may be possible for some apps to hold something like a lock, preventing the system from shutting down
			//wait a few seconds before shutting down
			setTimeout(function(){
				process.exit(code);
			}, 4000);
		});
	},
	postReset: function(request, response){
		utils.Events.fire('system-db-resetting', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds before resetting
			setTimeout(function(){
				mongoose.connection.db.dropDatabase(function(error, result){
					if (!utils.Misc.isNullOrUndefined(error)) {
						response.end(utils.Misc.createResponse(null, error));
					}
					else {
						response.send(utils.Misc.createResponse(result));
						//TODO: consider shutting down Bolt here if result==true (the system is highly unstable here and should be restarted)
					}
				});
			}, 4000);
		});
	},
	postResetCollection: function(request, response){
		var collection = utils.String.trim(request.params.collection);
		utils.Events.fire('system-collection-resetting', { body: { collection: collection } }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds before resetting
			setTimeout(function(){
				mongoose.connection.db.dropCollection(collection, function(error, result){
					if (!utils.Misc.isNullOrUndefined(error)) {
						response.end(utils.Misc.createResponse(null, error));
					}
					else {
						response.send(utils.Misc.createResponse(result));
					}
				});
			}, 4000);
		});
	},
	postSync: function(request, response){
		utils.Events.fire('system-syncing', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//sync db
				//sync bolt
			}, 2000);
		});
	},
	postSyncBolt: function(request, response){
		utils.Events.fire('system-bolt-syncing', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//pull bolt
				//push bolt
			}, 2000);
		});
	},
	postSyncDB: function(request, response){
		utils.Events.fire('system-db-syncing', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//push db
			}, 2000);
		});
	},
	postPush: function(request, response){
		utils.Events.fire('system-pushing', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//push db
				//push bolt
			}, 2000);
		});
	},
	postPushBolt: function(request, response){
		utils.Events.fire('system-bolt-pushing', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//push bolt
			}, 2000);
		});
	},
	postPushDB: function(request, response){
		utils.Events.fire('system-db-pushing', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//push db
			}, 2000);
		});
	},
	postPull: function(request, response){
		utils.Events.fire('system-pulling', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//pull db
				//pull bolt
			}, 2000);
		});
	},
	postPullBolt: function(request, response){
		utils.Events.fire('system-bolt-pulling', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				/*Git.Clone("https://git.heroku.com/guarded-journey-25495.git", "C:\\Users\\frank\\Documents\\Node.js\\bolt\\test_nodegit").then(function(repository) {
				  // Work with the repository object here.
				  console.log(repository)
				  response.send();
				});*/
				pullBolt('C:\\Users\\frank\\Documents\\Node.js\\bolt\\test_nodegit', 'heroku', 'master', function(errFetch, oid) {
				    if (errFetch) {console.log('errFetch');console.log(errFetch);
				        //return errFetch;
				    }
				    console.log('oid');console.log(oid);
				    response.send();
				});
			}, 2000);
		});
	},
	postPullDB: function(request, response){
		utils.Events.fire('system-db-pulling', { body: {} }, request.bolt.token, function(eventError, eventResponse){
			//wait a few seconds
			setTimeout(function(){
				//pull db
			}, 2000);
		});
	}
};
