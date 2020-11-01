"use strict";

document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		loadIcons("icons/all").then(function (iconMgr) {
			iconMgr.updateIconsAll();
			self.iconMgr = iconMgr;
		});
	};
});
