"use strict";

var appUI = {};
appUI.ctrl = {}; // Control elements
appUI.disp = {}; // Display elements
appUI.drhs = {}; // Direct handles
appUI.s4ns = {}; // Stats for Nerds

// UI styling
var uiResize = function (succeed) {
	// Adjust filename area
	appUI.disp.mediaName.style.width = (innerWidth - 148).toString() + "px";
	new Promise(function (r) {
		WCSME.TextDialElement.update();
		r();
	});
	if (succeed) {
		if (succeed.constructor == Function) {
			console.info("[AppUI] Promise UIResize fulfilled.");
			succeed();
		};
	};
};

document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		loadIcons("icons/all").then(function (iconMgr) {
			iconMgr.updateIconsAll();
			self.iconMgr = iconMgr;
		});
		// Initialize GUI
		appUI.disp.mediaName = $("#text-media-name");
		// Initialize TinyUI
		$$(".tui-textdial").forEach((e) => {
			new WCSME.TextDialElement(e);
		});
		// Initialize direct handless
		Object.defineProperty(appUI.drhs, "mediaName", {
			"get": function () {
				return appUI.disp.mediaName.textDial.text;
			},
			"set": function (mName) {
				appUI.disp.mediaName.textDial.text = mName;
			}
		});
		// Stylize UI
		self.addEventListener("resize", uiResize);
		uiResize();
	} else if (this.readyState == "complete") {
		new Promise(uiResize);
	};
});
