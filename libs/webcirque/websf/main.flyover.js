"use strict";

/*
WEBSF.Flyover is a module to provide more patches and tweaks to further support after WEBSF.main.catalyst is loaded.
*/

// Why not use FileReader to polyfill .arrayBuffer and .text ?
try {
	Blob.prototype.get = function (type) {
		var upThis = this, type = type || "";
		return new Promise(function (p, r) {
			var reader = new FileReader();
			reader.onabort = function (event) {
				r(event);
			};
			reader.onerror = function (event) {
				r(event);
			};
			reader.onload = function (event) {
				p(event.target.result);
			};
			switch (type.toLowerCase()) {
				case "arraybuffer":
				case "arrbuff": {
					reader.readAsArrayBuffer(upThis);
					break;
				};
				case "text":
				case "atext":
				case "str":
				case "string": {
					reader.readAsText(upThis);
					break;
				};
				case "bintext":
				case "binstr":
				case "binarystring": {
					reader.readAsBinaryString(upThis);
					break;
				};
				case "dataurl": {
					reader.readAsDataURL(upThis);
				};
				default : {
					throw TypeError("Unsupported type");
				};
			};
		});
	};
	Blob.prototype.text = Blob.prototype.text || function () {
		return this.get("str");
	};
	Blob.prototype.unicodeText = function () {
		return this.get("str");
	};
	Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || function () {
		return this.get("arrbuff");
	};
	Blob.prototype.binaryString = function () {
		return this.get("binstr");
	};
	Blob.prototype.dataURL = function () {
		return this.get("dataurl");
	};
	Blob.prototype.getURL = function () {
		var url = this.objectURL || URL.createObjectURL(this);
		this.objectURL = url;
		return url;
	};
	Blob.prototype.revokeURL = function () {
		if (this.objectURL) {
			URL.revokeObjectURL(this);
			this.objectURL = undefined;
		} else {
			throw (new Error("Not registered"));
		};
	};
} catch (err) {};

try {
	self.DOMTokenList.prototype.on = function (id) {
		if (!this.contains(id)) {
			this.add(id);
		};
	};
	self.DOMTokenList.prototype.off = function (id) {
		if (this.contains(id)) {
			this.remove(id);
		};
	};
} catch (err) {};

String.prototype.alter = function (map) {
	let wtAr = Array.from(this);
	let wlist = [];
	let wstart = 0;
	let wname = "";
	let wmode = 0; //0 for $ searching, 1 for ${ confirm, 2 for ${} name add
	let wres = "";
	let alterItem = function (start, name, value) {
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
	};
	wtAr.forEach((e, i) => {
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
					wlist.push(new alterItem(wstart, wname, ""));
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
		wtAr.splice(wstart - 1 - stOffset, wname.length + 3);
		e.start -= stOffset;
		stOffset += wname.length + 3;
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
	wtAr.forEach((e) => {
		wres += e;
	});
	return (wres);
};

// Try async style loading
self.styleAsynd = self.styleAsynd || function (listOfScripts) {
	var srcs = Array.from(arguments), promiseObj;
	var actionCheck = function (proceed, failSrc) {
		proceed();
	};
	if (Compare.type(String, srcs) == srcs.length) {
		promiseObj = new Promise ((p) => {
			srcs.forEach(function (e) {
				var k = document.createElement("link");
				k.rel = "stylesheet";
				k.href = e;
				document.head.appendChild(k);
			});
		});
	} else {
		throw(new TypeError("only type String is allowed"));
	};
	return promiseObj;
};
// Try async plain script loading
self.importAsynd = self.importAsynd || function (listOfScripts) {
	var srcs = Array.from(arguments), doneCount = 0, undoneList = [], successCount = 0, promiseObj;
	var actionCheck = function (proceed, failSrc) {
		if (failSrc) {
			undoneList.push(failSrc);
		} else {
			successCount ++;
		};
		doneCount ++;
		if (doneCount == srcs.length) {
			proceed({"allSuccess": successCount == doneCount, "failed": undoneList});
		};
	};
	if (Compare.type(String, srcs) == srcs.length) {
		promiseObj = new Promise ((p) => {
			srcs.forEach(function (e) {
				var k = document.createElement("script");
				k.src = e;
				k.onload = function () {
					actionCheck(p);
				};
				k.onerror = function () {
					actionCheck(p, this.src);
				};
				document.head.appendChild(k);
			});
		});
	} else {
		throw(new TypeError("only type String is allowed"));
	};
	return promiseObj;
};
importAsynd.imported = new Set();
