"use strict";

// Initiate targets
var msgpw;

document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		/*if (window.wenv) {
			if (wenv.env.trust && wenv.env.trustver && !(wenv.env.danger)) {

			};
		};*/
		self.addEventListener("message", function (msg) {
			switch (msg.data.type) {
				case "loadstage" : {
					switch (msg.data.loadstage) {
						case "check": {
							console.log("Sent signal to start a security check.");
							msgpw = msg.source;
							msgpw.postMessage({type: "action", from: "init", action: "check"}, "*");
							break;
						};
					};
				};
			};
			//debugger;
		});
		self.el = {};
		el.pane = document.querySelector("#main-pane");
		el.pane.src = "web/check.htm";
		el.pane.contentWindow.addEventListener("message", function (msg) {
		});
	};
});
