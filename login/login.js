"use strict";


//-**********************************************************************************************-
// DEFAULT PROPERTIES
const SERVERNAME_DEFAULT = "beta.flythings.io/api/";
//-**********************************************************************************************-

const path = require('path');
const appRoot = path.resolve(__dirname);

const fs = require('fs');
const http = require('request');
const readlineSync = require('readline-sync');
const util = require("../common/util.js");

//-*********************************************************************************************-
var properties;
try {
	properties = JSON.parse(fs.readFileSync(appRoot + '/../properties.json', 'utf8'));
} catch (e) {
	util.print("Error: Unreachable the properties.json file on the root directory of the project");
	process.exit();
}
if (!properties.user) {
	util.print("Error: User property are not defined in properties.json");
	process.exit();
}
const baseServerName = properties.serverName? properties.serverName : SERVERNAME_DEFAULT;
const debug = properties.debug? properties.debug : false;
//-**********************************************************************************************-

//-**********************************************************************************************-
const user = properties.user;
var password;
//-**********************************************************************************************-

//-**********************************************************************************************-
// CONFIGURATION VALUES
const SERVER_NAME = baseServerName + 'login/';
const URL = "http://" + SERVER_NAME;
const METHOD = "GET";
//-**********************************************************************************************-

function init () {
	//-**********************************************************************************************-
	// CONFIGURATION VALUES
	const HEADERS = {
		"Authorization": "Basic " + new Buffer(user + ":" + password).toString('base64')
	};
	//-**********************************************************************************************-

	//-**********************************************************************************************-
	var Login = module.exports = {};
	function login (success, error) {
		var options = {
			url: URL,
			headers: HEADERS,
			method: METHOD
		};
		if (debug) {
			util.print("Request:");
			util.print(JSON.stringify(options));
		}
		http(options, function (err, response, body) {
			if (response.statusCode >= 400) {
				error(JSON.parse(body));
			} else {
				success(JSON.parse(body));
			}
		});
	}
	Login.login = login;
	//-**********************************************************************************************-

	//-**********************************************************************************************-
	//Main Test
	//	login(function (success) {
	//		util.print(JSON.stringify(success));
	//		//			util.print(success.workspace);
	//		//			util.print(success.token);
	//	}, function (error) {
	//		util.print("Login test #> Error: " + JSON.stringify(error));
	//	});
	//-**********************************************************************************************-
}

if (!properties.password) {
	console.log("**********\nAtención!! Ten cuidado que la librería de lectura en línea a veces espera un salto de línea antes leer la contraseña,\npor lo tanto, verifica primero, solo con la primera letra, que aparece oculta (***).\nDisculpa las molestias.\n**********")
	password = readlineSync.question("Password (" + user + ") #> ", {hideEchoBack: true});
	util.nl();
	if (password != undefined && password != "") {
		init();
	} else {
		util.print("Error: Invalid password selected");
		process.exit();
	}
} else {
	password = properties.password;
	init();
}