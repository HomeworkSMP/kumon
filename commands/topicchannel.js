const ms = require("ms");
const { SlashCommandBuilder, MessageFlags, ButtonBuilder } = require("discord.js");

module.exports = {
	name: "topicchannel",
	description: "Manage channels in the HomeworkSMP Category.",
	data: new SlashCommandBuilder()
		.setName("hwsmpchannel")
		.setDescription("Manage channels in the HomeworkSMP Category.")
		.addSubcommand(subcommand =>
			subcommand.setName("create")
				.setDescription("Create a HomeworkSMP topic channel.")
				.addStringOption(option =>
					option.setName("name")
						.setDescription("Channel name.")
						.setRequired(true))
				.addStringOption(option =>
					option.setName("type")
						.setDescription("Channel type.")
						.setRequired(true)
						.addChoices(
							{ name: "text", value: "text" },
							{ name: "forum", value: "forum" },
							{ name: "announcement", value: "announcement" },
						))
				.addStringOption(option =>
					option.setName("topic")
						.setDescription("Channel topic.")))
		.addSubcommand(subcommand =>
			subcommand.setName("edit")
				.setDescription("Edit a HomeworkSMP topic channel.")
				.addStringOption(option =>
					option.setName("name")
						.setDescription("New channel name."))
				.addStringOption(option =>
					option.setName("topic")
						.setDescription("New channel topic.")))
		.addSubcommand(subcommand =>
			subcommand.setName("archive")
				.setDescription("Archive a HomeworkSMP topic channel.")),
	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
		case "create": {
			const name = interaction.options.getString("name").replace(/\s+/g, "-").toLowerCase();
			const topic = interaction.options.getString("topic");
			const category = interaction.guild.channels.cache.get("1223709856515756153") || await interaction.guild.channels.fetch("1223709856515756153");
			const channels = (await interaction.guild.channels.fetch()).filter(c => c.parentId == category.id);
			const ownedChannels = await channels.filter(c => c.topic?.split(" ").at(-1) == interaction.user.id);

			if (!/^[\w-]{1,100}$/.test(name)) return interaction.reply({ content: "Invalid channel name. Channel names can only contain letters, numbers, underscores, and hyphens, and must be between 1 and 100 characters long.", flags: MessageFlags.Ephemeral });

			if (await channels.find(c => c.name === name)) return interaction.reply({ content: "A channel with that name already exists in the HomeworkSMP Category.", flags: MessageFlags.Ephemeral });
			if (ownedChannels.size >= 3 && interaction.user.id !== "428445352354643968") return interaction.reply({ content: "You have reached the maximum number of channels you can create in the HomeworkSMP Category (3). If you wish to create more channels, please contact <@428445352354643968>.", flags: MessageFlags.Ephemeral });

			const newChannel = await category.children.create({
				name: name,
				type: interaction.options.getString("type") === "text" ? 0 : interaction.options.getString("type") === "forum" ? 15 : 5,
				topic: `${topic || ""} ${ topic && (await interaction.guild.members.fetch(topic.split(" ").at(-1))) != null && topic.split(" ").at(-2) === "|" && interaction.user.id === "428445352354643968" ? "" : `| ${interaction.user.id}`}`,
				position: channels.size,
			});

			interaction.reply({ content: `Channel <#${newChannel.id}> has been successfully created in the HomeworkSMP Category!`, flags: MessageFlags.Ephemeral });
			break;
		}
		case "edit": {
			if (interaction.channel.parentId != "1223709856515756153") return interaction.reply({ content: "This command can only be used in channels within the HomeworkSMP Category.", flags: MessageFlags.Ephemeral });
			if (interaction.channel.topic.at(-1) != interaction.user.id && interaction.user.id !== "428445352354643968") return interaction.reply({ content: "You do not own this channel and cannot edit it.", flags: MessageFlags.Ephemeral });
			const newName = interaction.options.getString("name")?.replace(/\s+/g, "-").toLowerCase();
			const newTopic = interaction.options.getString("topic");
			if (newName) {
				if (!/^[\w-]{1,100}$/.test(newName)) return interaction.reply({ content: "Invalid channel name. Channel names can only contain letters, numbers, underscores, and hyphens, and must be between 1 and 100 characters long.", flags: MessageFlags.Ephemeral });
				interaction.channel.edit({ name: newName });
			}
			console.log(newTopic);
			if (newTopic) {
				const ownerId = interaction.channel.topic.at(-1);
				try {
					interaction.channel.edit({ topic: `${newTopic} | ${ownerId}` });
				}
				catch (error) {
					console.error("Error editing channel topic:", error);
					return interaction.reply({ content: "There was an error updating the channel topic. Please try again later.", flags: MessageFlags.Ephemeral });
				}
			}
			interaction.reply({ content: `Channel <#${interaction.channel.id}> has been successfully edited!`, flags: MessageFlags.Ephemeral });
			break;
		}
		case "archive": {
			if (interaction.channel.parentId != "1223709856515756153") return interaction.reply({ content: "This command can only be used in channels within the HomeworkSMP Category.", flags: MessageFlags.Ephemeral });
			if (interaction.channel.topic.at(-1) != interaction.user.id && interaction.user.id !== "428445352354643968") return interaction.reply({ content: "You do not own this channel and cannot archive it.", flags: MessageFlags.Ephemeral });

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder({
					custom_id: "yes",
					label: "Yes",
					style: ButtonStyle.Success,
				}),
				new ButtonBuilder({
					custom_id: "no",
					label: "No",
					style: ButtonStyle.Danger,
				}),
			);

			// interaction.reply({ content: "Are you sure you want to archive this channel? This action cannot be undone.", components: [row], flags: MessageFlags.Ephemeral });

			interaction.channel.edit({ parent: interaction.guild.channels.cache.get("1398848467413241856") || await interaction.guild.channels.fetch("1398848467413241856") });
			interaction.reply({ content: `Channel <#${interaction.channel.id}> has been successfully archived!`, flags: MessageFlags.Ephemeral });
			break;
		}
		default:
			return interaction.reply({ content: "Invalid subcommand.", flags: MessageFlags.Ephemeral });
		}
	},
};