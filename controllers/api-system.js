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
		var code = parseInt(utils.String.trim(request.params.code), 10);
		process.exit(code);
	},
	postReset: function(request, response){
		mongoose.connection.db.dropDatabase(function(error, result){
			if (!utils.Misc.isNullOrUndefined(error)) {
				response.end(utils.Misc.createResponse(null, error));
			}
			else {
				response.send(utils.Misc.createResponse(result));
				//TODO: consider shutting down Bolt here if result==true (the system is highly unstable here and should be restarted)
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
