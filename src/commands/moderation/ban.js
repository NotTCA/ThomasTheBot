const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the ban.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
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
            .setDescription("You can't ban yourself.")
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
              "You can't ban someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    if (!member.bannable)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("I can't ban that member.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    const reason =
      interaction.options.getString("reason") || "No reason specified.";

    member.ban({ reason });

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`${member} has been **banned** | \`${member.id}\``)
          .setColor(client.config.color),
      ],
    });
  },
};
