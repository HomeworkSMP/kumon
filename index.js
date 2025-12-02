const { Client, Partials, Events, Collection, IntentsBitField } = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");

const bot = new Client({
	intents: new IntentsBitField(53608447),
	partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User, Partials.ThreadMember, Partials.GuildScheduledEvent, Partials.Poll, Partials.PollAnswer],
});

module.exports = { bot };

bot.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if ("data" in command && "execute" in command) {
		bot.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
	}
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	}
	else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.on(Events.MessageCreate, async (message) => {
	if (message.author.bot || (!message.inGuild()) || message.author.equals(bot.user)) return;
	const args = message.content.split(" ");
});

bot.login(token);