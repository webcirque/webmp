"use strict";

/*
This script is for checking the environment which the script is running. It uses environment-specific checks and userAgent string to check. It will also tell if the userAgent string is forged or not.
Also, this script will check for features the environment has or doesn't have. Requires WEBSF.main.alter to be loaded ahead.
Write this script to make it as compatible as possible.
Thanks to @mumuy on GitHub for mumuy/browser, and @RobW on StackOverflow for his/her amazing answer!
*/

// Collects information to help decide the type and version of the environment
var WEnv = function () {
	// Local variables
	var docEntries = [];
	// Result shortcuts
	this.core = null;
	this.modded = false;
	this.moddedName = null;
	this.moddedFrom = null;
	this.version = [];
	this.version.ua = [];
	this.type = null;
	this.ostext = null;
	this.ostype = null;
	this.osver = null;
	// Collecting factors to help decide browser's real properties
	this._features = [];
	this.tags = [];
	// Running tests
	// If window does not present, the script must be running without GUI. Window only? Obsolete.
	try {
		window;
		this._features.push("window");
	} catch (err) {};
	try {
		self;
		this._features.push("self");
	} catch (err) {};
	// Worker?
	try {
		if (self.importScripts) {
			this._features.push("importScripts");
		};
	} catch (err) {}
	// Basic polyfills for window and self
	if (!(this._features.withAnyd("self"))) {
		window.self = window;
	};
	if (!(this._features.withAnyd("window"))) {
		self.window = self;
	};
	// Navigator?
	if (self.Navigator) {
		if (self.navigator) {
			this._features.push("navigator");
			if (navigator.userAgent) {
				this._features.push("useragent");
			};
		};
	};
	// CSS?
	if (self.CSS) {
		this._features.push("cssApi");
	};
	// Intl API?
	if (self.Intl) {
		if (Intl.Collator) {
			if (Intl.Collator.constructor == Function) {
				this._features.push("intlApi");
			};
		};
	};
	// A2B and B2A?
	if (Compard.able(self.atob, self.btoa) > 0) {
		if (Compard.type(Function, atob, btoa) > 0) {
			this._features.push("a2b");
		};
	};
	// SpeechGrammar? (Must not be Safari)
	if (self.webkitSpeechGrammar) {
		if (webkitSpeechGrammar.constructor == Function) {
			this._features.push("speechGrammar");
		};
	};
	// Does let present? (ES6)
	try {
		eval('let r1 = "things"');
		this._features.push("let");
	} catch (err) {};
	// Arrow functions? (ES6)
	try {
		eval('var r1 = () => {}');
		this._features.push("arrowFunction");
	} catch (err) {};
	// New object accessing measures? (ES6)
	try {
		var r1 = {a: 1, b: 2};
		eval('r1["a"]');
		this._features.push("objectAccess");
		for (var name in document) {
			docEntries.push(name);
		};
	} catch (err) {};
	// Async functions? (ES2017)
	try {
		eval('var r1 = async function () {await new Promise((p) => {p();});}');
		this._features.push("async");
	} catch (err) {console.log(err.stack)};
	// If ImageCapture API is present (Chrome 59)
	if (self.ImageCapture) {
		if (ImageCapture.constructor == Function) {
			this._features.push("imageCapture");
		};
	};
	// Object rest? (Chrome 60)
	try {
		var r1 = {a: 1, b: 2};
		eval("({...r1})");
		var r2 = {c: 3, d: 4};
		var r3 = eval("({...r1, ...r2})");
		this._features.push("restObject");
	} catch (err) {};
	// If Network Information is usable (Chrome 61)
	if (self.NetworkInformation) {
		if (navigator.connection.constructor == NetworkInformation) {
			this._features.push("netInfo");
		};
	};
	// CSS.supports exists? (Chrome 61, Firefox 55)
	if (this._features.withAlld("cssApi")) {
		if (CSS.supports) {
			if (CSS.supports.constructor == Function) {
				this._features.push("cssSupports");
			};
		};
	};
	// If Network Information is detailed (Chrome 62)
	if (this._features.withAlld("navigator", "netInfo")) {
		if (navigator.connection.effectiveType) {
			this._features.push("netInfoDetailed");
		};
	};
	// If Font Variation Settings exist (Chrome 62)
	// display: minimal-ui (Chrome 80)
	if (this._features.withAlld("cssApi", "cssSupports")) {
		if (CSS.supports("font-variation-settings", "'wght' 700")) {
			this._features.push("fontVarConf");
		};
		if (CSS.supports("display", "minimal-ui")) {
			this._features.push("dispMinUI");
		};
	};
	// Intl.PluralRules? (Chrome 63, Firefox 58)
	// DisplayNames? (Chrome 81, Firefox not yet)
	if (this._features.withAlld("intlApi")) {
		if (Intl.PluralRules) {
			if (Intl.PluralRules.constructor == Function) {
				this._features.push("intlPluralRules");
			};
		};
		if (Intl.DisplayNames) {
			if (Intl.DisplayNames.constructor == Function) {
				this._features.push("intlDispNames");
			};
		};
	};
	// ResizeObserver? (Chrome 64, Firefox 69)
	if (self.ResizeObserver) {
		if (ResizeObserver.constructor == Function) {
			this._features.push("resizeObserver");
		};
	};
	// PerformanceServerTiming? (Chrome 65, Firefox 61)
	if (self.PerformanceServerTiming) {
		if (PerformanceServerTiming.constructor == Function) {
			this._features.push("perfSvrTiming");
		};
	};
	// Navigator Clipboard? (Chrome 66, Firefox 63)
	if (this._features.withAlld("navigator")) {
		if (navigator.clipboard) {
			this._features.push("navClipboard");
			if (navigator.clipboard.readText) {
				this._features.push("navClipboardRead");
			};
			if (navigator.clipboard.writeText) {
				this._features.push("navClipboardWrite");
			};
		};
	};
	// BigInt? (Chrome 67, Firefox 68)
	if (self.BigInt) {
		try {
			if (BigInt(1) === eval('1n')) {
				this._features.push("bigInt");
			};
		} catch (err) {};
	};
	// PageLife? (Chrome 68)
	if (docEntries.withAlld("onfreeze", "onresume")) {
		this._features.push("pageLife");
	};
	// OffscreenCanvas? (Chrome 69)
	if (self.OffscreenCanvas) {
		if (self.OffscreenCanvas.constructor == Function) {
			this._features.push("offscreenCanvas");
		};
	};
	// WebLocks? (Chrome 69)
	if (self.LockManager && this._features.withAlld("navigator")) {
		if (navigator.locks) {
			if (navigator.locks.constructor == LockManager) {
				this._features.push("webLocks");
			};
		};
	};
	// GamepadList? (removed in Chrome 70)
	if (!(self.GamepadList)) {
		this._features.push("noGamepadList");
	};
	// Intl.RelativeTimeFormat (Chrome 71, Chrome 65)
	if (this._features.withAlld("intlApi")) {
		if (Intl.RelativeTimeFormat) {
			if (Intl.RelativeTimeFormat.constructor == Function) {
				this._features.push("intlRelaTime");
			};
		};
		// Intl.format? (Chrome 72)
		if (Intl.ListFormat) {
			this._features.push("intlListFormat");
		};
		// Intl.Locale? (Chrome 74, Firefox 75)
		if (Intl.Locale) {
			if (Intl.Locale.constructor == Function) {
				this._features.push("intlLocale");
			};
		};
	};
	// String.matchAll? (Chrome 73, Firefox 67)
	if (String.prototype.matchAll) {
		if (String.prototype.matchAll.constructor == Function) {
			this._features.push("stringMatchAll");
		};
	};
	// Blob.text, arrayBuffer and stream? (Chrome 76, Firefox 69)
	if (self.Blob) {
		if (Blob.prototype.text && Blob.prototype.arrayBuffer && Blob.prototype.stream) {
			if (Compare.type(Function, [
				Blob.prototype.text,
				Blob.prototype.arrayBuffer,
				Blob.prototype.stream
			]) >= 3) {
				this._features.push("easyBlobReading");
			};
		};
	};
	// onFormData? (Chrome 77, Firefox 72)
	if (this._features.withAlld("objectAccess")) {
		if (docEntries.withAnyd("onformdata")) {
			this._features.push("onFormData");
		};
	};
	// CSS.registerProperty (Chrome 78, Firefox not yet)
	if (this._features.withAlld("cssApi")) {
		if (CSS.registerProperty) {
			if (Compare.type(Function, [CSS.registerProperty])) {
				this._features.push("cssRegProp");
			};
		};
	};
	// WebXR support (Chrome 79, Firefox not yet)
	var tmpArray = [self.XR, self.XRFrame, self.XRViewport, self.XRSession, self.XRSpace, self.XRView, self.XRPose];
	if (Compare.able(tmpArray) > 0) {
		if (Compare.type(Function, tmpArray) > 0) {
			this._features.push("webxr");
		};
	};
	var tmpArray = undefined;
	// Optional Chaining (Chrome 80, Firefox 74)
	try {
		if (this._features.withAlld("a2b")) {
			if (Compard.able(eval('window?.btoa'))) {
				this._features.push("optChaining");
			};
		};
	} catch (err) {};
	// There are no Chrome 82!
	// Shape Detection API
	if (Compard.able(self.FaceDetector, self.BarcodeDetector, self.TextDetector) > 0) {
		if (Compard.type(Function, self.FaceDetector, self.BarcodeDetector, self.TextDetector)) {
			this._features.push("shapeDetection");
		};
	};
	// Browser-based detection
	if (!(this._features.withAnyd("window")) && !(this._features.withAnyd("self"))) {
		this.type = "worker";
	} else {
		this.type = "page";
	};
	// Core
	if ((!!window.opr && !!opr.addons) || !!window.opera) {
		this.core = "opera";
		this.moddedName = "opera";
		this.moddedFrom = "no";
	};
	if (self.InstallTrigger || self.firefox) {
		this.core = "firefox";
		this.moddedName = "firefox";
		this.moddedFrom = "foss";
	};
	if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) {//From StackOverflow by RobW
		this.core = "safari";
		this.moddedName = "safari";
		this.moddedFrom = "us";
	};
	if (/*@cc_on!@*/false || !!document.documentMode) {//From StackOverflow by RobW
		this.core = "ie";
		this.moddedName = "ie";
		this.moddedFrom = "us";
	};
	if (this.core != "ie" && !!window.StyleMedia) {
		this.core = "edge";
		this.moddedName = "edge";
		this.moddedFrom = "us";
	};
	if (window.chrome) {
		this.core = "chrome";
	};
	// Deeper comparison of Safari and Chromium if above failed
	if (Compard.able(self.webkitMediaStream, self.webkitRequestFileSystem, self.webkitResolveLocalFileSystemURL, self.WebkitMutationObserver) > 0) {
		if (this._features.withAlld("speechGrammar")) {
			this.core = "chrome";
		} else {
			this.core = "safari";
			this.moddedName = "safari";
			this.moddedFrom = "us";
		};
	};
	// ECMA levels
	{
		this.ecmaLevel = 0;
		if (this._features.withAlld("let", "arrowFunction", "objectAccess")) {
			this.ecmaLevel = 1;
			if (this._features.withAlld("restObject", "async")) {
				this.ecmaLevel = 2;
			};
		};
	};
	{
		//Try to decode userAgent provided runtime versions
		var pmode = 0;
		var pidx = 0;
		var pkey = [[""]];
		var uastr = navigator.userAgent || "NoGUI";
		for (var cp = 0; cp < uastr.length; cp ++) {
			var e = uastr[cp];
			switch (pmode) {
				case 0: {
					// Enters environment name
					if (e != "/") {
						pkey[pidx][0] += e;
					} else {
						pmode = 1;
						pkey[pidx][1] = "";
					};
					break;
				};
				case 1: {
					// Ignores one character
					if (e != " ") {
						//Merge the key
						pkey[pidx][1] += e;
					} else {
						pmode = 2;
					};
					break;
				};
				case 2: {
					if (e == "(") {
						pkey[pidx][2] = "";
						pmode = 3;
					} else {
						pidx ++;
						pkey[pidx] = [];
						pkey[pidx][0] = e;
						pmode = 0;
					};
					break;
				};
				case 3: {
					if (e != ")") {
						pkey[pidx][2] += e;
					} else {
						pidx ++;
						pkey[pidx] = [];
						pkey[pidx][0] = "";
						pmode = 4;
					};
					break;
				};
				case 4: {
					pmode = 0;
					break;
				};
			};
		};
		//console.info(pkey);
		var uadecver = [], bktver = [], tmptver = [];
		var copied = this;
		pkey.forEach(function (h) {
			switch (h[0]) {
				case "Mozilla": {
					copied.ostext = h[2];
					break;
				};
				case "Chrome":
				case "Chromium": {
					if (copied.core == "chrome") {
						tmptver = h[1].split(".");
						tmptver.forEach(function (e) {
							uadecver.push(parseInt(e));
						});
					};
					break;
				};
				case "Safari": {
					if (copied.core == "safari") {
						tmptver = h[1].split(".");
						tmptver.forEach(function (e) {
							uadecver.push(parseInt(e));
						});
					};
					break;
				};
				case "Firefox": {
					if (copied.core == "firefox") {
						tmptver = h[1].split(".");
						tmptver.forEach(function (e) {
							uadecver.push(parseInt(e));
						});
					};
					break;
				};
				case "Edg": {
					if (copied.core == "edge") {
						tmptver = h[1].split(".");
						tmptver.forEach(function (e) {
							uadecver.push(parseInt(e));
						});
					};
					break;
				};
			};
		});
		// Browser specific tests
		if (this.core == "chrome") {
			//{ If Chromium, check for real versions and versions provided by userAgent
			var aver = [], dver = [], minver = 0, maxver = 90;
			// Available version check
			(this._features.withAlld("imageCapture")) ? (aver.push(59)) : (dver.push(59));
			(this._features.withAlld("restObject")) ? (aver.push(60)) : (dver.push(60));
			(this._features.withAlld("netInfo", "cssSupports")) ? (aver.push(61)) : (dver.push(61));
			(this._features.withAlld("netInfoDetailed", "fontVarConf")) ? (aver.push(62)) : (dver.push(62));
			(this._features.withAlld("intlPluralRules")) ? (aver.push(63)) : (dver.push(63));
			(this._features.withAlld("resizeObserver")) ? (aver.push(64)) : (dver.push(64));
			(this._features.withAlld("perfSvrTiming")) ? (aver.push(65)) : (dver.push(65));
			(this._features.withAlld("navClipboard")) ? (aver.push(66)) : (dver.push(66));
			(this._features.withAlld("bigInt")) ? (aver.push(67)) : (dver.push(67));
			(this._features.withAlld("pageLife")) ? (aver.push(68)) : (dver.push(68));
			(this._features.withAlld("webLocks", "offscreenCanvas")) ? (aver.push(69)) : (dver.push(69));
			(this._features.withAlld("noGamepadList")) ? (aver.push(70)) : (dver.push(70));
			(this._features.withAlld("intlRelaTime")) ? (aver.push(71)) : (dver.push(71));
			(this._features.withAlld("intlListFormat")) ? (aver.push(72)) : (dver.push(72));
			(this._features.withAlld("stringMatchAll")) ? (aver.push(73)) : (dver.push(73));
			(this._features.withAlld("intlLocale")) ? (aver.push(74)) : (dver.push(74));
			// Chrome has 75, but undetectable
			(this._features.withAlld("easyBlobReading")) ? (aver.push(76)) : (dver.push(76));
			(this._features.withAlld("onFormData")) ? (aver.push(77)) : (dver.push(77));
			(this._features.withAlld("cssRegProp")) ? (aver.push(78)) : (dver.push(78));
			(this._features.withAlld("webxr")) ? (aver.push(79)) : (dver.push(79));
			(this._features.withAnyd("optChaining", "dispMinUI")) ? (aver.push(80)) : (dver.push(80));
			(this._features.withAlld("intlDispNames")) ? (aver.push(81)) : (dver.push(81));
			// No 82 available
			(this._features.withAlld("shapeDetection")) ? (aver.push(83)) : (dver.push(83));
			// Debugging end
			console.log(aver.toString());
			console.log(dver.toString());
			//Decode raw to applicable values
			for (var pt = 1; pt < aver.length; pt ++) {
				if ((aver[pt] - aver[pt-1]) < 3) {
					minver = aver[pt];
				} else {
					break;
				};
			};
			var runVer = false;
			if (dver.length > 1) {
				for (var pt1 = 0; pt1 < dver.length; pt1 ++) {
					maxver = dver[dver.length - pt1 - 1];
					if (pt1 < dver.length - 1) {
						var delta = (dver[dver.length - pt1 - 1] - dver[dver.length - pt1 - 2]);
						if (delta > 1) {
							if (delta == 2) {
								if (dver[dver.length - pt1 - 1] != 83 && dver[dver.length - pt1 - 1] != 76) {
									this.modded = true;
									runVer = true;
									break;
								};
							} else {
								this.modded = true;
								runVer = true;
								break;
							};
						};
					};
				};
			};
			console.log("Detected possible version: " + minver + "~" + maxver);
			if (uadecver) {
				if (uadecver.length > 0) {
					console.log("User Agent provided version: " + uadecver);
					if (uadecver[0] < minver || uadecver[0] >= maxver) {
						console.log("Forged Chromium version detected!");
						this.version = [minver];
						this.uaversion = uadecver;
						this.tags.push("forged-ver");
					} else {
						this.version = uadecver;
					};
				};
			};
		};
	};
	// Comparing different browsers with UA and Fingerprints
	if (this.core == "chrome") {
		// UA match
		if (this._features.withAlld("navigator", "useragent")) {
			if (navigator.userAgent.indexOf("Edg") != -1) {
				this.moddedName = "edge";
				this.moddedFrom = "us";
			};
			if (navigator.userAgent.indexOf(' OPR/') != -1) {
				this.moddedName = "opera";
				this.moddedFrom = "no";
			};
			if (navigator.userAgent.indexOf(' Brav') != -1) {
				this.moddedName = "brave";
				this.moddedFrom = "foss";
			};
			if (navigator.userAgent.withAnyd(' Firefox', 'MSIE', 'Trident', 'iPhone; CPU iPhone OS', 'Symbian/')) {
				this.tags.push("forged-core");
			};
			// Bulk country query
			// Chinese browsers
			{
				var tmpulist = ["qh", "qihoo", "360ee", "360se", "uc", "ubrowser", "qq", "baidu", "bidu", "maxthon", "metasr", "sogou", "lbbr", "2345e", "2345b", "115b", "world", "miuib", "quark", "qiyu", "micromess", "aliapp", "weibo", "douban", "snebuy", "iqiyi", "dingtalk", "huawei"], bMatched = false, bName = "";
				tmpulist.forEach(function (e) {
					if (navigator.userAgent.toLowerCase().withAlld(e)) {
						bMatched = true;
						bName = e;
					};
				});
				if (bMatched) {
					switch (bName) {
						case "qh":
						case "qihoo":
						case "360se":
						case "360ee": {
							bName = "360";
							break;
						};
						case "ubrowser": {
							bName = "uc";
							break;
						};
						case "bidu": {
							bName = "baidu";
							break;
						};
						case "2345e":
						case "2345b": {
							bName = "2345"
							break;
						};
						case "miuib": {
							bName = "miuisys";
							break;
						};
						case "micromess": {
							bName = "wechat";
							break;
						};
					};
					this.modded = true;
					this.moddedName = bName;
					this.moddedFrom = "cn";
				};
			};
			//Russian browsers
			//Fallback
			if (!(this.moddedName) && !(this.moddedFrom)) {
				this.moddedName = "chrome";
				this.moddedFrom = "us";
			};
		};
		// Fingerprints
		if (self.process) {
			if (process.versions.electron) {
				this.moddedName = "electron";
				this.moddedFrom = "foss";
				this.modded = true;
			};
		};
		if (self.Brave) {
			this.moddedName = "brave";
			this.moddedFrom = "foss";
			this.modded = true;
		};
		// MIME types
		var mimeTypes = [];
		if (self.navigator) {
			if (navigator.mimeTypes) {
				for (var cb = 0; cb < navigator.mimeTypes.length; cb ++) {
					mimeTypes.push(navigator.mimeTypes[cb].type);
				};
			};
		};
		// 360 Chromium fingerprints
		if (mimeTypes.withAnyd("application/360softmgrplugin", "application/mozilla-npqihooquicklogin", "application/vnd.chromium.remoting-viewer", "application/asx") || (this.version[0] > 36 && self.showModalDialog)) {
			this.moddedName = "360";
			this.moddedFrom = "cn";
			this.modded = true;
		};
		// 2345 fingerprints
		if (self.chrome) {
			if (chrome.adblock2345 || chrome.common2345) {
				this.moddedName = "2345";
				this.moddedFrom = "cn";
				this.modded = true;
			};
		};
	} else if (this.core == "ie" || this.core == "edge") {
		// 360 Non-chromium fingerprints
	  switch(window.screenTop - window.screenY){
		  case 71:
		  case 99:
		  case 102:
		  case 75:
		  case 105:
		  case 104: {
			  this.moddedName = "360";
			  this.moddedFrom = "cn";
			  this.modded = true;
			  break;
		  };
	  };
		// Push versions without detection
		if (uadecver.length > 0) {
			this.version = uadecver;
		};
	} else {
		// Push versions without detection
		if (uadecver.length > 0) {
			this.version = uadecver;
		};
	};
	// Common browser designing faults
	{
		var danger = false;
		if (self.navigator) {
			if (navigator.mimeTypes) {
				if (Array.from(navigator.mimeTypes).indexOf("application/npqqwebgame") > -1) {
					this.modded = true;
					this.tags.push("unnecessary-plugin");
				};
			};
			if (navigator.plugins) {
				if (navigator.plugins.length > 8) {
					this.modded = true;
					this.tags.push("exceeded-plugin");
				};
			};
		};
		if (danger) {
			this.tags.push("security-defect");
		};
	};
	// Final tags pushNotification
	if (this.moddedName) {
		this.tags.push("n:" + this.moddedName);
	};
	if (this.moddedFrom) {
		this.tags.push("by:" + this.moddedFrom);
	};
	if (this.core) {
		this.tags.push("c:" + this.core);
	};
	if (this.modded) {
		this.tags.push("mod_" + this.moddedFrom);
	};
};

var wenv = new WEnv();
