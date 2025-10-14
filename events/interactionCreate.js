const { Events } = require("discord.js");
const { bot } = require("../index.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!(interaction.isCommand() || interaction.isButton() || interaction.isContextMenuCommand() || interaction.isSelectMenu() || interaction.isMessageContextMenuCommand())) return;
		if (!interaction.inGuild()) return;
		// @ts-ignore
		const command = bot.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	},
};