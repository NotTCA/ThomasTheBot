const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The amount of time for the mute.")
        .setRequired(true)
        .addChoices(
          { name: "1 minute", value: "60s" },
          { name: "5 minutes", value: "5m" },
          { name: "10 minutes", value: "10m" },
          { name: "1 hour", value: "1h" },
          { name: "1 day", value: "1d" },
          { name: "1 week", value: "7d" }
        )
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
            .setDescription("You can't mute yourself.")
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
              "You can't mute someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    if (!member.moderatable)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("I can't mute that member.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    const time = interaction.options.getString("time");

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.timeout(ms(time), reason);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${member} has been **muted** | \`${member.id}\``)
          .setColor(client.config.color),
      ],
    });
  },
};
