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
				bot.user.setPresence({ activities: [{ name: "Playing on HomeworkSMP", type: 0 }], status: "idle" });
				break;
			case 1:
				bot.user.setPresence({ activities: [{ name: "Listening to Mud's Non-Sense", type: 2 }], status: "idle" });
				break;
			case 2:
				bot.user.setPresence({ activities: [{ name: "Watching the player count", type: 3 }], status: "idle" });
				break;
			default:
				bot.user.setPresence({ activities: [{ name: "Playing on HomeworkSMP", type: 0 }], status: "idle" });
				break;
			}
		}, 60000);
		const getLastActoMessage = async function() {
			const hwsmpChatMsgs = await (await bot.channels.fetch("1223705840335196182")).messages.fetch({ limit: 100 });
			return await hwsmpChatMsgs.filter(m => m.author.id == "428445352354643968").first();
		};
		const isActoAlive = async () => {
			const lastActoMsg = await getLastActoMessage();
			if (lastActoMsg) {
				console.log(lastActoMsg.createdTimestamp);
			}
			else {
				console.log("No message found for Acto.");
			}
		};
		isActoAlive();
		setInterval(isActoAlive, 86400000);
	},
};