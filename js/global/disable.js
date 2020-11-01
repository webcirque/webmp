"use strict";
self.disableFalse = function () {
	return false;
};
self.disableEvent = function (ev) {
	ev.preventDefault();
	ev.stopImmediatePropagation();
	return false;
};
