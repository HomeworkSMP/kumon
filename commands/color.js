const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function isHexColor(hex) {
	return typeof hex === "string"
        && /^[0-9A-Fa-f]{6}$/.test(hex);
}

module.exports = {
	name: "color",
	type: "slash",
	data: new SlashCommandBuilder()
		.setName("color")
		.setDescription("Color your name")
		.addStringOption(option =>
			option.setName("hex")
				.setMaxLength(6)
				.setMinLength(6)
				.setDescription("Color of your name (in HEX, without #)")
				.setRequired(true)),
	async execute(interaction) {
		const color = interaction.options.getString("hex");
		if (isHexColor(color) == false) return interaction.reply({ content: "That is not a valid hex color! Please use the option hex to specify a valid color. \rIf you are having difficulties figuring out what is a hex color code, use [this](https://htmlcolorcodes.com/color-picker/).", ephemeral: true });
		const embed = new EmbedBuilder()
			.setDescription(`Your name color has been set to ${color}!`)
			.setColor(`#${color}`)
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setFooter({ text: "HomeworkSMP is kinda .gay", iconURL: interaction.client.user.displayAvatarURL() });
		const memberRole = interaction.guild.roles.cache.find(role => role.name == interaction.user.id);
		if (memberRole) {
			try {
				await memberRole.setColor(`#${color}`);
			}
			catch (ex) {
				console.log(ex);
				await interaction.reply({ content: "Failed to set role color, please retry.", ephemeral: true });
				return;
			}
		}
		else {
			let givenrole;
			try {
				givenrole = await interaction.guild.roles.create({
					name: interaction.user.id,
					color: `#${color}`,
				});
			}
			catch (ex) {
				console.log(ex);
				await interaction.reply({ content: "Failed to create role, please retry.", ephemeral: true });
				return;
			}
			try {
				await interaction.member.roles.add(givenrole.id);
			}
			catch (ex) {
				const roleToDelete = interaction.guild.roles.cache.find(role => role.name == interaction.user.id);
				await roleToDelete.delete();
				console.log(ex);
				await interaction.reply({ content: "Failed to add role, please retry.", ephemeral: true });
				return;
			}
		}
		await interaction.reply({ embeds: [embed], ephemeral: true });
		const presetColors = ["1397476232307675176", "1397476282425544815", "1397476328089059420", "1397476362981216366", "1397476402546348174", "1397476442757140560", "1397476474390450266", "1397476525472743535", "1397476526391296080", "1397477024192401489"];
		for (const presetColor of presetColors) {
			if (interaction.member.roles.cache.has(role.id)) {
				await interaction.member.roles.remove(role.id);
			}
		}
	},
};