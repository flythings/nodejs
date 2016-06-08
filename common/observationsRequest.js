"use strict";

const path = require('path');
const appRoot = path.resolve(__dirname);

const fs = require('fs');
const http = require('request');

//-*********************************************************************************************-
const properties = JSON.parse(fs.readFileSync(appRoot + '/../properties.json', 'utf8'));
const debug = properties.debug? properties.debug : false;
//-*********************************************************************************************-

const util = require("../common/util.js");
//-*********************************************************************************************-

function saveObservations (options, successCallback, errorCallback) {
	if (debug) {
		util.print("Request:");
		util.print(JSON.stringify(options));
	}
	http(options, function (error, response, body) {
		if (error || response.statusCode >= 400) {
			if (response) {
				errorCallback(error, response.statusCode);
				if (debug) {
					util.print('Error-status: ' + response.statusCode + "   " + response.statusMessage);
				}
			} else {
				errorCallback(error, undefined);
				if (debug) {
					util.print("Error: " + JSON.stringify(error));
				}
			}
		} else {
			successCallback(body, response.statusCode);
			if (debug) {
				util.print('Success-status: ' + response.statusCode + "   " + response.statusMessage);
			}
		}
	});
}

//-*********************************************************************************************-
var Observation = module.exports = saveObservations;
//-*********************************************************************************************-