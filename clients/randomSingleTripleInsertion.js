"use strict";

//-**********************************************************************************************-
// DEFAULT PROPERTIES
const SERVERNAME_DEFAULT = "beta.flythings.io/api/";
const FOI_DEFAULT = "Foi Test";
const PROCEDURE_DEFAULT = "Procedure Test";
const PROPERTY_DEFAULT = "Property Test";
const UNIT_DEFAULT = "Unit Test";
const MINUTES_DEFAULT = 15;
//-**********************************************************************************************-

//-**********************************************************************************************-
// LIBRARIES
const path = require('path');
const appRoot = path.resolve(__dirname);

const fs = require('fs');
const http = require('request');
const cron = require("cron").CronJob;

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
console.log("			Welcome to the single insert observations");
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

login.login(function (success) {
	HEADERS["X-AUTH-TOKEN"] = success.token;
	HEADERS["Workspace"] = success.workspace;
	util.print("Login Success");
	init();
}, function (error) {
	util.print("Error: " + JSON.stringify(error));
	process.exit();
});

const minutes = properties.minutes? properties.minutes : MINUTES_DEFAULT;
const foi = properties.foi? properties.foi : FOI_DEFAULT;
const procedure = properties.procedure? properties.procedure : PROCEDURE_DEFAULT;
const property = properties.property? properties.property : PROPERTY_DEFAULT;
const unit = properties.unit? properties.unit : UNIT_DEFAULT;
//-**********************************************************************************************-

//-**********************************************************************************************-
// FUNCTIONALITY METHODS
function createObservation () {
	var observation = {
		foi: foi,
		procedure: procedure,
		observableProperty: property,
		time: util.now() * 1000,
		value: util.random(10, 40),
		uom: unit
	};
	return observation;
}

function sendData () {
	var opts = {
		url: URL,
		headers: HEADERS,
		method: METHOD,
		body: createObservation(),
		json: true
	};
	obsrequest(opts, function (body, status) {
		util.print("Success");
	}, function (error, status) {
		util.print("Error");
	});
}

function init () {
	var job = new cron({
		cronTime: '*/' + minutes + ' * * * *',
		onTick: function() {
			util.print("Starting process ...");
			sendData();
		},
		start: true
	});
}
//-**********************************************************************************************-