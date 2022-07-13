const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the kick.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const member = interaction.options.getMember("user");

    if (!member)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("That member is no longer in the server.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    if (member.id === interaction.user.id)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("You can't kick yourself.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(
              "You can't kick someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    if (!member.kickable)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("I can't kick that member.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.kick(reason);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${member} has been **kicked** | \`${member.id}\``)
          .setColor(client.config.color),
      ],
    });
  },
};
