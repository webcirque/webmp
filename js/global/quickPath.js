"use strict";
self.disableFalse = function () {
	return false;
};
self.disableEvent = function (ev) {
	ev.preventDefault();
	ev.stopImmediatePropagation();
	return false;
};

self["$"] = self["$"] || function (selector, source) {
	var src = source || document;
	return src.querySelector(selector);
};
self["$$"] = self["$$"] || function (selector, source) {
	var src = source || document;
	return Array.from(src.querySelectorAll(selector));
};
