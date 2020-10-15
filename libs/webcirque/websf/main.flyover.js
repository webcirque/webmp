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

// Try async plain script loading
self.importAsync = self.importAsync || function () {
	var srcs = arguments;
	if (Compare.type(String, srcs) == srcs.length) {
		console.log("Type check passed.");
	};
};
