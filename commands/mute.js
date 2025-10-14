const ms = require("ms");
const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "mute",
	description: "Mutes a member in the server.",
	data: new SlashCommandBuilder()
		.setName("mute")
		.setDescription("Mutes a member in the server.")
		.addUserOption(option =>
			option.setName("target")
				.setDescription("The member to mute")
				.setRequired(true))
		.addStringOption(option =>
			option.setName("duration")
				.setDescription("Duration of the mute (e.g., 10m, 1h, 1d)")
				.setRequired(true))
		.addStringOption(option =>
			option.setName("reason").setDescription("The reason for muting")
				.setRequired(false)),
	async execute(interaction) {
		if (!(interaction.member.roles.cache.some(role => role.name === "Community Moderator") || interaction.member.id == interaction.guild.ownerId)) return interaction.reply({ content: "You do not have permission to use this command.", flags: MessageFlags.ephemeral });

		const target = interaction.options.getUser("target");
		const duration = interaction.options.getString("duration");
		const reason = interaction.options.getString("reason") || "No reason provided";

		const member = await interaction.guild.members.fetch(target.id);
		if (!member) return interaction.reply({ content: "Member not found.", flags: MessageFlags.ephemeral });
		try {
			await member.timeout(ms(duration), `Muted by ${interaction.user.username} (${interaction.user.id}) for reason: ${reason}`);
		}
		catch (error) {
			interaction.reply({ content: `Failed to mute member. Error: ${error.message}`, flags: MessageFlags.ephemeral });
			console.error(error);
			return;
		}
		interaction.reply({ content: `<@${target.id}> has been successfully muted for **${ms(ms(duration))}**!`, flags: MessageFlags.ephemeral });
		interaction.channel.send(`<@${target.id}> has been muted for **${ms(ms(duration))}**. Reason: **${reason}**`);
		try {
			await target.send(`You have been **muted** in HomeworkSMP for **${ms(ms(duration))}**. Reason: ${reason}`);
		}
		catch {}
	},
};