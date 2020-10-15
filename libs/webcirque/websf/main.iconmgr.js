"use strict";

var IconMgr = function (rootDir = "", conf) {
	var upThis = this;
	this.rootDir = rootDir;
	// Sizes
	var sizeMap = new Map();
	this.getSize = function (name) {
		if (sizeMap.has(name)) {
			return sizeMap.get(name);
		};
	};
	this.setSize = function (name, width, height, modify = true) {
		if (sizeMap.has(name)) {
			if (!sizeMap.get(name).m) {
				throw ReferenceError("Tried to tinker with non-editable entry");
			};
		};
		var obj = {w: width, h: height, m: modify};
		sizeMap.set(name, obj);
		return obj;
	};
	this.delSize = function (name) {
		var cand = null;
		if (sizeMap.has(name)) {
			cand = sizeMap.get(name);
		};
		sizeMap.delete(name);
		return cand;
	};
	var getISize = function (text) {
		var candidate = null;
		if (text) {
			if (text.indexOf("~") == 0) {
				while (text.indexOf("~~") != -1) {
					text = text.replace("~~", "~");
				};
				candidate = sizeMap.get(text.slice(1));
			} else {
				var result = text.split(",");
				result.forEach(function (e, i, a) {
					a[i] = Math.round(parseFloat(e));
				});
				candidate = {w: result[0], h: result[1], m: false};
			};
		};
		return candidate;
	};
	// Icons
	this.defaultSize = {};
	var iconMap = new Map();
	this.getIcon = function (name, root = true) {
		var res = null;
		if (iconMap.has(name)) {
			res = {src: "", size: null};
			if (root) {
				res.src = this.rootDir;
			};
			var tmp = iconMap.get(name);
			res.src += tmp.src;
			res.size = tmp.size || upThis.defaultSize;
		};
		return res;
	};
	this.setIcon = function (name = "", src = "", size) {
		var vsize = size || this.defaultSize;
		var res = {src: src, size: vsize};
		iconMap.set(name, res);
	};
	this.delIcon = function (name) {
		var candidate = null;
		if (iconMap.has(name)) {
			candidate = iconMap.get(name);
		};
		iconMap.delete(name);
		return candidate;
	};
	// Updates
	this.updateConf = function (jconf) {
		if (jconf) {
			// Clear the old ones
			iconMap.forEach(function (e, i) {
				iconMap.delete(i);
			});
			sizeMap.forEach(function (e, i) {
				sizeMap.delete(i);
			});
			// Restart
			this.name = jconf.name;
			this.identifier = jconf.identifier;
			// Add the sizes
			jconf.iconMgr.sizes.forEach(function (e) {
				upThis.setSize(e.ref, getISize(e.size).w, getISize(e.size).h, false);
			});
			this.defaultSize = getISize(jconf.iconMgr.default);
			// Add the resources
			jconf.resources.forEach(function (e) {
				upThis.setIcon(e.id, e.src, getISize(e.size || "~default"));
			});
		};
	};
	this.updateIcon = function (name) {
		if (iconMap.has(name)) {
			var tgt = this.getIcon(name);
			Array.from(document.getElementsByClassName("icon-" + name)).forEach(function (e) {
				e.src = tgt.src;
				e.style.width = tgt.size.w.toString() + "px";
				e.style.height = tgt.size.h.toString() + "px";
				if (self.debugMode) {
					console.log("Icon [${id}] updated.")
				};
			});
		};
	};
	this.updateIconsA = function (ids) {
		ids.forEach(function (el) {
			upThis.updateIcon(el);
		});
	};
	this.updateIcons = function () {
		return this.updateIconsA(arguments);
	};
	this.updateIconsAll = function () {
		iconMap.forEach(function (etmp, i) {
			upThis.updateIcon(i);
		});
	};
	//Initialize
	this.updateConf(conf);
};
