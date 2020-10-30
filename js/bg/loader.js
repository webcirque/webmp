"use strict";
document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		importAsynd("../js/bg/" + ((self.browser) ? "webExtension" : "chromium") + "/webReqHijack.js");
	};
});
