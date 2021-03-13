"use strict";

var reasonText;
var switchPane = function (tid) {
	Array.from(document.querySelectorAll(".medium-window")).forEach((e, i) => {
		e.style.display = "none";
		if (e.id == tid) {
			e.style.display = "";
		};
		Array.from(document.querySelectorAll(".loader-webcirque")).forEach((e, i) => {
			e.style.animation = "";
		});
	});
};
var rejectwr = function (reason) {
	switchPane("win-reject");
	var rejectWindow = document.querySelector("#win-reject");
	reasonText.innerText = reason + "\nDetails: " + JSON.stringify(self.wenv);
	reasonText.style.width = (rejectWindow.clientWidth - 16) + "px";
	reasonText.style.height = (rejectWindow.clientHeight - 152) + "px";
};
var warnwr = function (reason) {
	switchPane("win-decide");
	var warnWindow = document.querySelector("#win-decide");
	var wreasonText = document.querySelector("#text-wreason");
	wreasonText.innerText = reason + "\nDetails: " + JSON.stringify(self.wenv);
	wreasonText.style.width = (warnWindow.clientWidth - 16) + "px";
	wreasonText.style.height = (warnWindow.clientHeight - 152) + "px";
};
var checkIt = function () {
	if (window.wenv) {
		switch (true) {
			case !(wenv.tags) : {
				rejectwr("Cannot conduct security tests.");
				break;
			};
			case wenv.tags.withAnyd("mod_cn", "mod_ru") : {
				rejectwr("Blocklisted browser.");
				break;
			};
			case wenv.tags.withAnyd("security-defect") : {
				rejectwr("Browser with unsafe behaviour.");
				break;
			};
			case wenv.tags.withAnyd("forged-core") : {
				rejectwr("Tried to forge another browser.");
				break;
			};
			case wenv.tags.withAnyd("forged-ver") : {
				warnwr("Tried to forge another version.\nReal version: " + wenv.version.toString() + "\nForged version: " + wenv.uaversion.toString());
				top.postMessage({"type": "loadstage", "from": "check", "loadstage": "ok"}, "*");
				setTimeout(function () {
					location.href = "base.htm";
				}, 5000);
				break;
			};
			default : {
				switchPane("win-resolve");
				top.postMessage({"type": "loadstage", "from": "check", "loadstage": "ok"}, "*");
				setTimeout(function () {
					location.href = "base.htm";
				}, 500);
			};
		};
	} else {
		rejectwr("Cannot load websf@webcirque.wenv");
	};
};

document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		// Elements
		reasonText = document.querySelector("#text-reason");
		// Functions
		self.top.postMessage(JSON.parse('{"loadstage": "check", "from": "check", "type": "loadstage"}'), "*");
		self.addEventListener("message", function (msg) {
			switch (msg.data.type) {
				case "action" : {
					switch (msg.data.action) {
						case "check": {
							console.log("Security check started.");
							Array.from(document.querySelectorAll(".loader-webcirque")).forEach((e, i) => {
								e.style.animation = "loadin 1s linear infinite"
							});
							setTimeout(checkIt, 550);
							break;
						};
					};
				};
			};
		});
	};
});
