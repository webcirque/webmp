"use strict";

/*
WEBSF.main.alter is a module for basic polyfills and patches to make all the requirements needed by WEBSF.main.wenv will be met, so it will not produce any error.
*/

// Ahead
var walterna = [];
if (!Array.prototype.indexOf) {
	walterna.push("noIndexOf");
};
// Looping functions made easy
try {
	Function.prototype.repeat = function (times) {
		for (var c = 0; c < times; c ++) {
			this();
		};
	};
} catch (err) {};
// If a number has...
Number.prototype.inside = function (maxRange) {
	return (this % maxRange + maxRange) % maxRange;
};
Number.prototype.within = function (min, max) {
	var range = max - min;
	if (range > 0) {
		return ((this - min).inside(range) + min);
	} else {
		throw(new RangeError("Maximum value cannot be lower than minimum value"));
	};
};
// Primitive compatibility layer for array
Array.from = Array.from || function (target) {
	var ans = [];
	if (target.length >= 0) {
		for (var pt = 0; pt < target.length; pt ++) {
			ans.push(target[pt]);
		};
	} else {
		throw Error("Illegal length");
	};
	return ans;
};
Array.prototype.filter = Array.prototype.indexOf || function (func) {
	var ans = [];
	if (func) {
		if (func.constructor == Function) {
			for (var pt = 0; pt < this.length; pt ++) {
				if (func(this[pt])) {
					ans.push(this[pt]);
				};
			};
		};
	};
	return ans;
};
Array.prototype.forEach = Array.prototype.forEach || function (defFunc) {
	for (var ptc = 0; ptc < this.length; ptc ++) {
		defFunc(this[ptc], ptc, this);
	};
};
Array.prototype.indexOf = Array.prototype.indexOf || function (del) {
	var ans = -1;
	if (del) {
		for (var pt = 0; pt < this.length; pt ++) {
			if (this[pt] == del) {
				ans = pt;
				break;
			};
		};
	};
	return ans;
};
Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function (del) {
	var ans = -1;
	if (del) {
		for (var pt = 0; pt < this.length; pt ++) {
			if (this[pt] == del) {
				ans = pt;
				break;
			};
		};
	};
	return ans;
};
// If an array has...
Array.prototype.reversed = function () {
	return this.slice().reverse();
};
Array.prototype.withCount = function (args) {
	var act = 0;
	for (var pt = 0; pt < args.length; pt ++) {
		if (this.indexOf(args[pt]) != -1) {
			act ++;
		};
	};
	return act;
};
Array.prototype.withAny = function (args) {
	return (this.withCount(args) > 0);
};
Array.prototype.withAll = function (args) {
	return (this.withCount(args) == args.length);
};
Array.prototype.withCountd = function () {
	return this.withCount(arguments);
};
Array.prototype.withAnyd = function () {
	return this.withAny(arguments);
};
Array.prototype.withAlld = function () {
	return this.withAll(arguments);
};
Array.prototype.matchAny = function (args) {
	var a1 = this, a2 = args, ans = false;
	if (a1.length < a2.length) {
		var a3 = a1;
		a1 = a2;
		a2 = a3;
	};
	for (var pt = 0; pt1 < a2.length; pt ++) {
		if (a1.indexOf(a2[pt]) != -1) {
			ans = true;
		};
	};
	return ans;
};

// Batch type comparison, one array-based, one argument-based
try {
	var Compare = function () {
		this.type = function (dType, args) {
			var count = 0;
			Array.from(args).forEach(function (e) {
				if (!!e) {
					if (e.constructor == dType) {
						count ++;
					};
				};
			});
			return count;
		};
		this.able = function (args) {
			var count = 0;
			Array.from(args).forEach(function (e) {
				if (e != null && e != undefined) {
					count ++;
				};
			});
			return count;
		};
	};
	Compare = new Compare();
} catch (err) {};
try {
	var Compard = function () {
		this.type = function () {
			var dType = arguments[0];
			var args = Array.from(arguments).slice(1, arguments.length - 1);
			return Compare.type(dType, args);
		};
		this.able = function () {
			return Compare.able(arguments);
		};
	};
	Compard = new Compard();
} catch (err) {};

// If a string has...
String.prototype.withCount = function (args) {
	var count = 0, copied = this.slice();
	Array.from(args).forEach(function (e) {
		if (copied.indexOf(e) != -1) {
			count ++;
		};
	});
	return count;
};
String.prototype.withAny = function (args) {
	return (this.withCount(args) > 0);
};
String.prototype.withAll = function (args) {
	return (this.withCount(args) == args.length);
};
String.prototype.withCountd = function () {
	return this.withCount(arguments);
};
String.prototype.withAnyd = function () {
	return (this.withCount(arguments) > 0);
};
String.prototype.withAlld = function () {
	return (this.withCount(arguments) == arguments.length);
};
try {
	String.prototype.parseMap = function () {
		var upThis = this;
		var decURI = arguments[1];
		if (decURI == undefined) {
			decURI = true;
		};
		var startChar = arguments[2] || "?";
		var breakChar = arguments[3] || "&";
		var assignChar = arguments[4] || "=";
		var query = upThis.replace(startChar, "");
		var valMap = new Map();
		if (query.length) {
			query = query.split(breakChar);
			query.forEach(function (e, i, a) {
				var key = "", value = "", valueYet = false;
				Array.from(e).forEach(function (e2) {
					if (!valueYet) {
						if (e2 == assignChar) {
							valueYet = true;
						} else {
							key += e2;
						};
					} else {
						value += e2;
					};
				});
				key = decodeURIComponent(key);
				value = decodeURIComponent(value);
				valMap.set(key, value);
			});
		};
		return valMap;
	};
} catch (err) {};
String.prototype.formText = function (map) {};

/* function wAlter (text, map) {
	let wtAr = Array.from(text);
	let wlist = [];
	let wstart = 0;
	let wname = "";
	let wmode = 0; //0 for $ searching, 1 for ${ confirm, 2 for ${} name add
	let wres = "";
	wtAr.forEach((e, i) => {
		//console.warn(i);
		switch (wmode) {
			case 0: {
				if (e == "$") {
					wmode = 1;
				};
				break;
			};
			case 1: {
				if (e == "{") {
					wstart = i - 1;
					wmode = 2;
				} else {
					wmode = 0;
				};
				break;
			};
			case 2: {
				if (e == "}") {
					wstart ++;
					wlist.push(new wAlter.alterItem(wstart, wname, ""));
					wstart = 0;
					wname = "";
					wmode = 0;
				} else {
					wname += e;
				};
				break;
			};
			default: {
				throw(new Error("Unknown mode $1 encountered at index $2.".replace("$1", wmode))).replace("$2", i);
			};
		};
	});
	let stOffset = 0;
	wlist.forEach((e) => {
		let wstart = e.start;
		let wname = e.name;
		console.log([wstart, wname]);
		wtAr.splice(wstart - 1 - stOffset, wname.length + 3);
		console.log(e.start);
		e.start -= stOffset;
		console.log(e.start);
		stOffset += wname.length + 3;
		console.log(wtAr);
	});
	stOffset = 0;
	wlist.forEach((e) => {
		let value = map[e.name];
		if (map[e.name] == undefined || map[e.name] == null) {
			e.value = Array.from("ERR_NULL");
		} else {
			let value = map[e.name];
			if (value.constructor == String) {
				e.value = Array.from(value);
			} else if (value.constructor == Number || value.constructor == BigInt) {
				e.value = Array.from(value.toString());
			} else {
				throw(new TypeError("Value \"$1\" must not be an explicit object.").replace("$1", e.name));
			};
		};
		wtAr.splice(e.start - 1 + stOffset, 0, ...e.value);
		stOffset += e.value.length;
	});
	console.log(wlist);
	wtAr.forEach((e) => {
		wres += e;
	});
	return (wres);
};
wAlter.alterItem = function (start, name, value) {
	if (start.constructor == Number) {
		this.start = start;
	} else {
		throw(new TypeError("Value \"start\" must be a Number."));
	};
	if (name.constructor == String) {
		this.name = name;
	} else {
		throw(new TypeError("Value \"name\" must be a String."));
	};
	if (value.constructor == String) {
		this.value = Array.from(value);
	} else if (value.constructor == Number || value.constructor == BigInt) {
		this.value = Array.from(value.toString());
	} else {
		throw(new TypeError("Value \"value\" must not be an explicit object."));
	};
};*/
