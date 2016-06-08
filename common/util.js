"use strict";

const path = require('path');
const appRoot = path.resolve(__dirname);

const fs = require('fs');
const dateFormat = require('dateformat');
const moment = require('moment');

//-*********************************************************************************************-
const pkg = JSON.parse(fs.readFileSync(appRoot + '/../package.json', 'utf8'));
//-*********************************************************************************************-

function getDate () {
	var now = new Date();
	return dateFormat(now, "dd/mm/yyyy HH:MM:ss");
}
function print(text, noDate) {
	if (noDate) {
		console.log(pkg.name, "#>", text);
	} else {
		console.log(getDate(), pkg.name, "#>", text); 
	}
}
function nl() {
	console.log("");
}
function now () { 
	return moment().unix(); 
}
function random (low, high) {
	return Math.random() * (high - low) + low;
}
function randomArray(num) {
	var array = [];
	for (var i = 0; i < num; i++) {
		if (is_incremental) {
			array[i] = random(20000, 600000);
		} else {
			array[i] = random(0, 10);
		}
	}
	return array;
}

//-*********************************************************************************************-

var Util = module.exports = {
	getDate : getDate,
	print: print,
	nl: nl,
	now: now,
	random: random,
	randomArray: randomArray
};

//-*********************************************************************************************-