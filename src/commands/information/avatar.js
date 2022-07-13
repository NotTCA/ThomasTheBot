const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gets the avatar of a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the avatar of.")
        .setRequired(false)
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.options.getMember("user") || interaction.member;

    const avatar = user.user.displayAvatarURL({ dynamic: true, size: 4096 });

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${user.user.username}'s avatar`)
          .setDescription(
            `[Click here to download](${avatar.replace("webp", "png")})`
          )
          .setImage(avatar)
          .setColor(client.config.color),
      ],
    });
  },
};
