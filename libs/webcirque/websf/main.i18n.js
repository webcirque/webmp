"use strict";

var LocaleHandler = function () {
	this.mappedKeys = {};
	var upThis = this;
	var originTitleDb = new Map();
	var lMap = "";
	var lList = [];
	this.get = function (id) {
		return this.mappedKeys[id];
	};
	this.getOriginDb = function () {
		return originTitleDb;
	};
	this.deployAll = function () {
		let tmpk = Array.from(document.getElementsByClassName("i18n-title"));
		tmpk.forEach(function (e) {
			if (originTitleDb.has(e)) {
				e.title = originTitleDb.get(e).alter(upThis.mappedKeys);
			} else {
				originTitleDb.set(e, e.title);
				e.title = e.title.alter(upThis.mappedKeys);
			};
		});
	};
	this.load = async function (url) {
		lMap = await (await fetch(url)).json();
		lList = (await (await fetch(lMap.list)).text()).split("\n");
		return await upThis.update(arguments[1]);
	};
	this.update = async function () {
		let localeMap = lMap;
		let localeList = lList;
		let languages, matches = [], finalDecision = new Set();
		if (self.wenv.type == "page") {
			languages = arguments[0] || navigator.languages.slice();
			languages.forEach(function (e, i, a) {
				a[i] = e.replace("-", "_");
			});
			languages.forEach(function (e, i, a) {
				if (e.indexOf("_") != -1) {
					let rootLang = e.slice(0, e.indexOf("_"));
					if (languages.indexOf(rootLang) == -1) {
						languages.splice(a.indexOf(e) + 1, 0, rootLang);
					};
				};
			});
			languages.forEach(function (e) {
				if (localeList.indexOf(e) != -1) {
					matches.push(e);
				};
			});
		};
		finalDecision.add(localeMap.default);
		if (matches.length > 0) {
			if (matches[0].indexOf("_") != -1) {
				finalDecision.add(matches[0].slice(0, matches[0].indexOf("_")));
			};
			finalDecision.add(matches[0])
		};
		finalDecision = Array.from(finalDecision);
		for (let pc = 0; pc < finalDecision.length; pc ++) {
			let localeCode = finalDecision[pc];
			for (let rootName in localeMap.components) {
				let i18nFile = await (await fetch(localeMap.loadFrom + localeCode + "/" + localeMap.components[rootName])).json();
				for (let keyName in i18nFile) {
					upThis.mappedKeys[rootName + "." + keyName] = i18nFile[keyName].message;
				};
			};
		};
		return true;
	};
};
