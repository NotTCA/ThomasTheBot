const { Client } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot")
        .setDescription("Test to see if the bot is online and running.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join")
        .setDescription("Test to see if the join feature is working.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leave")
        .setDescription("Test to see if the leave feature is working.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {Client} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === "bot") {
      return interaction.reply("I'm online and running!");
    }

    if (subCommand === "join") {
      client.emit("guildMemberAdd", interaction.member);
      return interaction.reply({
        content: `Check the <#${client.config.channels.frontdoor}> channel.`,
        ephemeral: true,
      });
    }

    if (subCommand === "leave") {
      client.emit("guildMemberRemove", interaction.member);
      return interaction.reply({
        content: `Check the <#${client.config.channels.frontdoor}> channel.`,
        ephemeral: true,
      });
    }
  },
};
