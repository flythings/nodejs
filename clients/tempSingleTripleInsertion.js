"use strict";

//-**********************************************************************************************-
// DEFAULT PROPERTIES
const SERVERNAME_DEFAULT = "beta.flythings.io/api/";
const FOI_DEFAULT = "PC Flythings";
const PROCEDURE_DEFAULT = "CPU-Memory";
const MINUTES_DEFAULT = 15;
//-**********************************************************************************************-

//-**********************************************************************************************-
// LIBRARIES
const path = require('path');
const appRoot = path.resolve(__dirname);

const fs = require('fs');
const http = require('request');
const cron = require("cron").CronJob;
const readlineSync = require('readline-sync');
const cpu = require('windows-cpu');

const util = require("../common/util.js");
const obsrequest = require("../common/observationsRequest.js");
//-*********************************************************************************************-

//-*********************************************************************************************-
// PROPERTIES AND PROJECT CONTEXT
var properties;
try {
	properties = JSON.parse(fs.readFileSync(appRoot + '/../properties.json', 'utf8'));
} catch (e) {
	util.print("Error: Unreachable the properties.json file on the root directory of the project");
	process.exit();
}
const baseServerName = properties.serverName? properties.serverName : SERVERNAME_DEFAULT;
const pkg = JSON.parse(fs.readFileSync(appRoot + '/../package.json', 'utf8'));
//-**********************************************************************************************-

//-**********************************************************************************************-
// WELCOME MESSAGES
console.log("*************************************************************************************");
console.log("		Welcome to the single insert observations by id");
console.log("*************************************************************************************");
util.nl();
util.print("Project executing: " + pkg.name + " (" + pkg.version + ")");
util.nl();
//-**********************************************************************************************-

//-*********************************************************************************************-
// LOGIN IMPORT
const login = require("../login/login.js");
//-*********************************************************************************************-

//-**********************************************************************************************-
// CONFIGURATION PARAMETERS
const SERVER_NAME = baseServerName + 'observation/single';
const URL = "http://" + SERVER_NAME;
const METHOD = "PUT";

var HEADERS = {
	"Content-Type": "application/json"
};

const minutes = properties.minutes? properties.minutes : MINUTES_DEFAULT;
const foi = properties.foi? properties.foi : FOI_DEFAULT;
const procedure = properties.procedure? properties.procedure : PROCEDURE_DEFAULT;

login.login(function (success) {
	HEADERS["X-AUTH-TOKEN"] = success.token;
	HEADERS["Workspace"] = success.workspace;
	util.print("Login Success");
	init();
}, function (error) {
	util.print("Error: " + JSON.stringify(error));
	process.exit();
});
//-**********************************************************************************************-

//-**********************************************************************************************-
// FUNCTIONALITY METHODS
function createObservation (property, unit, value) {
	if (property && unit) {
		var observation = {
			foi: foi,
			procedure: procedure,
			observableProperty: property,
			time: util.now() * 1000,
			value: value != undefined? value : util.random(10, 40),
			uom: unit
		};
		return observation;
	} else {
		util.print("Error: Invalid property or unit to insert");
	}
}

function sendData (observation) {
	var opts = {
		url: URL,
		headers: HEADERS,
		method: METHOD,
		body: observation,
		json: true
	};
	if (opts.body) {
		obsrequest(opts, function (body, status) {
			util.print("Success");
		}, function (error, status) {
			util.print("Error");
		});
	}
}

function cpuPrint () {
	//Total CPU Load
	cpu.totalLoad(function(error, results) {
		if(error) {
			return console.log(error);
		}
		for (var i = 0; i < results.length; i++) {
			sendData(createObservation("CPU " + i + " Usage", "%", results[i]));
		}
	});
	//Total Node.js CPU Processors
	cpu.nodeLoad(function(error, results) {
		if(error) {
			return console.log(error);
		}
		if (results.found) {
			sendData(createObservation("Node CPU Usage", "%", results.load));
			sendData(createObservation("Node Processors", "process", results.found.length));
		}
	});
	//Total Google Chrome CPU Processors
	cpu.findLoad('chrome', function(error, results) {
		if(error) {
			return console.log(error);
		}
		if (results.found) {
			sendData(createObservation("Chrome CPU Usage", "%", results.load));
			sendData(createObservation("Chrome Processors", "process", results.found.length));
		}
	});
	//Total Memory Usage
	cpu.totalMemoryUsage(function(error, results) {
		if(error) {
			return console.log(error);
		}
		if (results.usageInMb) {
			sendData(createObservation("Memory Usage", "Mb", results.usageInMb));
		}
	});
}
function init () {
	var job = new cron({
		cronTime: '*/' + minutes + ' * * * *',
		onTick: function() {
			util.print("Starting process ...");
			cpuPrint();
		},
		start: true
	});
}
//-**********************************************************************************************-