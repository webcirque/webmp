"use strict";
self.disableFalse = function () {
	return false;
};
self.disableEvent = function (ev) {
	ev.preventDefault();
	ev.stopImmediatePropagation();
	return false;
};

self.getEvent = function (event) {
	console.log([event.type, event]);
};

/*
self["$"] = self["$"] || function (selector, source) {
	var src = source || document;
	return src.querySelector(selector);
};
self["$$"] = self["$$"] || function (selector, source) {
	var src = source || document;
	return Array.from(src.querySelectorAll(selector));
};
HTMLElement.prototype.$ = function (selector) {
	return $(selector, this);
};
HTMLElement.prototype.$$ = function (selector) {
	return $$(selector, this);
};
*/
