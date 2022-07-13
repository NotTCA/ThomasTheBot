const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmutes a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the mute.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
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
            .setDescription("You can't unmute yourself.")
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
              "You can't unmute someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    if (!member.moderatable)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("I can't unmute that member.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.timeout(null, reason);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${member} has been **unmuted** | \`${member.id}\``)
          .setColor(client.config.color),
      ],
    });
  },
};
