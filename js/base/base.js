"use strict";

// Pre-announce variables
var bgContainer, bgImgEl, iconMgr, tabBtns, tabFrames, state = {}, config = {};
var tabNames = ["core", "audio", "lib", "open", "conf"];

// Load languages
var i18nHandler = new LocaleHandler();
i18nHandler.load("../conf/localeMap.json").then(function () {
	i18nHandler.deployAll();
});
self.addEventListener("languagechange", function () {
	i18nHandler.update().then(function () {
		i18nHandler.deployAll();
	});
});

// Switch the tabs
var actTabSwitch = function () {
	tabBtns.forEach(function (e) {
		e.classList.off("sel-active");
	});
	this.classList.on("sel-active");
	state.activeTab = tabNames[tabBtns.indexOf(this)];
	self.top.postMessage({"type": "switchTab", "value": state.activeTab});
};
var regTabSwitch = function () {
	tabBtns.forEach(function (e) {
		e.addEventListener("pointerup", actTabSwitch);
	});
	state.activeTab = tabNames[0];
};

// Image resizer
var bgResize = function () {
	let cWidth = bgContainer.clientWidth;
	let cHeight = bgContainer.clientHeight;
	let cRatio = cWidth / cHeight;
	bgImgEl.forEach(function (e) {
		let nWidth = e.naturalWidth;
		let nHeight = e.naturalHeight;
		let nRatio = nWidth / nHeight;
		// Clean up previous size
		e.style.width = "";
		e.style.height = "";
		if (!(nWidth * nHeight > 0)) {
			//console.warn("Failed resizing element: %o", e);
		} else if (nRatio > cRatio) {
			e.style.width = (cHeight * nRatio).toString() + "px";
		} else if (nRatio < cRatio) {
			e.style.height = (cWidth / nRatio).toString() + "px";
		};
	});
}
// Element resizer
var eleResize = function () {
	bgResize();
};

// Resizing?
self.addEventListener("resize", function () {
	eleResize();
});
// Loaded?
document.addEventListener("readystatechange", function () {
	switch (this.readyState.toLowerCase()) {
		case "loading": {
			break;
		};
		case "interactive": {
			// Get the elements
			bgContainer = document.querySelector(".background");
			bgImgEl = [
				document.querySelector("#bg-main"),
				document.querySelector("#bg-tween")
			];
			tabBtns = Array.from(document.querySelectorAll("#tabs-tabs div.tab-unit"));
			// Resize async
			new Promise(function (p, r) {
				eleResize();
				p();
			});
			// Load icons
			loadIcons("icons/all").then(function (iconMgr) {
				iconMgr.updateIconsAll();
				self.iconMgr = iconMgr;
			});
			// Disable auxclick
			document.body.oncontextmenu = function () {
				return false;
			};
			// Translate!
			i18nHandler.deployAll();
			// TabSwitch
			regTabSwitch();
			// Post Success
			self.top.postMessage({"type": "loadProgress", "value": "base"})
			break;
		};
		case "complete": {
			// Resize the elements
			eleResize();
			break;
		};
	};
});
