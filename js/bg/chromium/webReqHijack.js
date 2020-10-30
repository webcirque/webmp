"use strict";

//Simplify console.info
var addlog = function () {
	console.info("[Web Request Hijack] " + arguments[0]);
};

//Started loading
addlog("Requested Chromium version.");

//Finished loading
addlog("Chromium version finished loading.")
