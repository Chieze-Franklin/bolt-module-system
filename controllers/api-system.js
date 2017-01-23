var config = require("bolt-internal-config");
var getRoutes = require("bolt-internal-get-routes");
var utils = require("bolt-internal-utils");
var models = require("bolt-internal-models");
var mongodb = require('mongodb');
var mongoose = require('mongoose');

module.exports = {
	get: function(request, response){
		response.redirect('/api/help');
	},
	getHelp: function(request, response){
		console.log(request.reqid);

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
		process.exit();
	},
	postExitCode: function(request, response){
		var code = parseFloat(utils.String.trim(request.params.code));//TODO: check for parseInt: replace here, bolt.js, ctl-sms-home
		process.exit(code);
	},
	postReset: function(request, response){
		var dropBoltDB = function() {
			mongoose.connection.db.dropDatabase(function(error, result){
				if (!utils.Misc.isNullOrUndefined(error)) {
					response.end(utils.Misc.createResponse(null, error));
				}
				else {
					response.send(utils.Misc.createResponse(result));
					//TODO: consider shutting down Bolt here if result==true (the system is highly unstable here and should be restarted)
				}
			});
		}

		//app dbs
		models.collection.find({}, function(err, collections){
			if (!utils.Misc.isNullOrUndefined(collections) && collections.length > 0) {
				collections.forEach(function(coll, index){
					var dbName = coll.app;
					var MongoClient = mongodb.MongoClient;
					MongoClient.connect('mongodb://localhost:' + config.getDbPort() + '/' + dbName, function(error, db) {
						db.dropDatabase(function(err, result){
							db.close();

							//after the last app's db has been dropped
							if(index == (collections.length - 1)) {
								dropBoltDB();
							}
						});
					});
				});
			}
			else { //if there's no collection just go ahead and delete bolt db
				dropBoltDB();
			}
		});
	},
	postResetCollection: function(request, response){
		var collection = utils.String.trim(request.params.collection);
		mongoose.connection.db.dropCollection(collection, function(error, result){
			if (!utils.Misc.isNullOrUndefined(error)) {
				response.end(utils.Misc.createResponse(null, error));
			}
			else {
				response.send(utils.Misc.createResponse(result));
			}
		});
	}
};
