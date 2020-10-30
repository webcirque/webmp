"use strict";

self.loadIcons = async function (src) {
	let resp = await fetch("../conf/" + src + ".json");
	let json = await resp.json();
	return new IconMgr("../img/", json);
};
