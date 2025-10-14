const { Events } = require("discord.js");
const { bot } = require("../index.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute() {
		console.log(`Logged in as ${bot.user.tag}`);
		setInterval(() => {
			switch (Math.floor(Math.random() * 3)) {
			case 0:
				bot.user.setPresence({ activities: [{ name: "HomeworkSMP", type: 0 }], status: "idle" });
				break;
			case 1:
				bot.user.setPresence({ activities: [{ name: "Mud's Non-Sense", type: 2 }], status: "idle" });
				break;
			case 2:
				bot.user.setPresence({ activities: [{ name: "the player count", type: 3 }], status: "idle" });
				break;
			default:
				bot.user.setPresence({ activities: [{ name: "HomeworkSMP", type: 0 }], status: "idle" });
				break;
			}
		}, 600000);
	},
};