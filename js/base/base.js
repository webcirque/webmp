"use strict";

// Pre-announce variables
var bgContainer, bgImgEl, iconMgr, tabs = {}, tabBtns, tabFrames, state = {}, config = {};
var tabNames = ["core", "audio", "lib", "open", "conf"];

// Temporary background filler
var bgImgUrl = "../img/bg/02.webp"

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

// Execute tab switch
var executeTS = function (id) {
	if (id > 0) {
		let aTabId = id;
		tabs.all.forEach(function (e, i) {
			if (i != aTabId) {
				tabs.all[i].style.display = "none";
			} else {
				tabs.all[i].style.display = "";
			};
		});
	};
	if (!config.intellihidePlayer) {
		tabs.all[0].style.display = "";
	};
};
// Switch the tabs
var actTabSwitch = function (ev) {
	tabBtns.forEach(function (e) {
		e.classList.off("sel-active");
	});
	this.classList.on("sel-active");
	state.activeTabId = tabBtns.indexOf(this);
	if (ev.button == 2 && state.activeTabId == 1) {
		state.activeTabId += 4;
	};
	state.activeTab = tabNames[state.activeTabId];
	tabs.slider.style.transform = "translateY(${percent}%)".alter({
		percent: Math.floor((!!state.activeTabId) * -100)
	});
	executeTS(state.activeTabId);
	self.top.postMessage({"type": "switchTab", "value": state.activeTab});
};
var regTabSwitch = function () {
	tabBtns.forEach(function (e) {
		e.addEventListener("pointerdown", actTabSwitch);
	});
	tabBtns[0].addEventListener("contextmenu", function () {
		$e(".tabline").style.display = "none";
	});
	tabBtns[1].addEventListener("contextmenu", function () {
		tabs.all[1].style.display = "none";
		tabs.all[5].style.display = "";
	});
	state.activeTabId = 0;
	state.activeTab = tabNames[0];
};

// Image resizer
var bgResize = function (proceed) {
	bgImgEl.forEach(function (e) {
		e.resize("", "");
		e.fit("fill");
	});
	(proceed || (function () {}))();
};
// Element resizer
var eleResize = function (proceed) {
	bgResize();
	(proceed || (function () {}))();
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
			bgContainer = $e(".background");
			bgImgEl = [
				$e("#bg-main"),
				$e("#bg-tween")
			];
			tabs.slider = $e(".tab-slider");
			tabs.core = $e("#t-audio");
			tabs.all = $a("iframe");
			tabBtns = $a("#tabs-tabs div.tab-unit");
			// Resize async
			new Promise(function (p, r) {
				eleResize();
				p();
			});
			// Load override stylesheet for extensions
			if (self.location.protocol == "chrome-extension:") {
				styleAsynd("../css/base/or/chromeExt.css");
			};
			// Disable auxclick
			document.body.oncontextmenu = disableFalse;
			// Translate!
			i18nHandler.deployAll();
			// TabSwitch
			regTabSwitch();
			// Post Success
			self.top.postMessage({"type": "loadProgress", "value": "base"});
			// All images not draggable
			$a("img").forEach(function (e) {
				e.ondrag = disableEvent;
				e.ondragstart = disableEvent;
				e.ondragend = disableEvent;
				e.ondragover = disableEvent;
				e.ondragenter = disableEvent;
				e.ondragleave = disableEvent;
			});
			// Special actions
			break;
		};
		case "complete": {
			// Load icons
			loadIcons("icons/all").then(function (iconMgr) {
				iconMgr.updateIconsAll();
				self.iconMgr = iconMgr;
			});
			bgImgEl[0].src = bgImgUrl;
			bgImgEl[0].addEventListener("loadstart", function () {
				new Promise(bgResize);
			});
			bgImgEl[0].decode().then(bgResize);
			// Resize the elements
			eleResize();
			break;
		};
	};
});
