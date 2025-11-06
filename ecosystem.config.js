module.exports = {
	apps: [{
		name: "Kumon",
		script: "./index.js",
		watch: true,
		ignore_watch: [
			"package-lock.json",
			"ecosystem.config.js",
			"node_modules",
		],
		autorestart: true,
		post_update: [
			"ncu -u",
			"npm i",
		],
		time: true,
	}],
};