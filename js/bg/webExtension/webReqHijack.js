"use strict";

//Simplify console.info
var addlog = function () {
	console.info("[Web Request Hijack] " + arguments[0]);
};

//Started loading
addlog("Requested WebExtensions version.");

//Finished loading
addlog("WebExtensions version finished loading.")
