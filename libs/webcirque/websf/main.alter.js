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

Array.prototype.same = function () {
	var res = true;
	this.forEach(function (e, i, a) {
		if (i < (a.length - 1)) {
			if (e.constructor != a[i + 1].constructor) {
				res = false;
			};
		};
	});
	return res;
};
// Get where to insert, or to find
Array.prototype.point = function (element) {
	var safeMode = arguments[1];
	if (safeMode != false) {
		safeMode = true;
	};
	// Initialize blocks
	var block = 1 << Math.floor(Math.log(this.length - 1) / Math.log(2));
	// Initialize pointer and continuation
	var pointer = block, resume = true;
	if (safeMode) {
		resume = this.same();
		if (element.constructor != this[0].constructor) {
			resume = false;
		};
		if (!resume) {
			pointer = -1;
		};
	};
	console.log("Block size " + block + ", pointer at " + pointer + ".");
	if (element <= this[0]) {
		pointer = 0;
		resume = false;
	} else if (element > this[this.length - 1]) {
		pointer = this.length;
		resume = false;
	};
	var lastblock = block;
	while (resume) {
		block /= 2;
		if (block < 1) {
			resume = false;
			console.log("Block size too small.");
		} else {
			if (this[pointer] > element) {
				if (this[pointer - 1] >= element) {
					pointer -= block;
				};
			} else if (this[pointer] < element) {
				pointer += block;
			};
		};
		if (lastblock <= block) {
			resume = false;
		};
		lastblock = block;
		console.log("Block size " + block + ", pointer at " + pointer + ".");
		// Finally exits the loop
	};
	console.log("Over. Points at " + pointer);
	return pointer;
};
Array.prototype.where = function (element) {
	var idx = this.point(element);
	if (this[idx] != element) {
		idx = -1;
	};
	return idx;
};

// Map!
/*var Map = self.Map || function (map) {
	var keys = [];
	var values = [];
	this.clear = function () {
		keys = [];
		values = [];
	};
	this.has = function (key) {
		return (keys.indexOf(key) != -1);
	};
	this.get = function (key) {
		var res = undefined;
		if (this.has(key)) {
			res = values[keys.indexOf(key)];
		};
		return res;
	};
	this.set = function (key) {
		//
	};
	this.getLegacyArray = function () {
		var tmpArr = [];
		keys.forEach(function (e, i) {
			tmpArr.push([e, values[i]]);
		});
		return tmpArr;
	};
	if (map) {
		var beforevalues = [];
		map.forEach(function (e) {
			keys.push(e[0]);
			beforevalues.push(e[1]);
		});
		var beforekeys = keys.slice();
		keys.sort();
		keys.forEach(function (e) {
			values.push(beforevalues[beforekeys.indexOf(e)]);
		});
	};
};*/

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
