const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Tells you the latency of the bot."),
  run: async (client, interaction) => {
    const res = await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("Pinging...")
          .setColor(client.config.color),
      ],
      ephemeral: true,
      fetchReply: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `**Pong! 🏓**\n\nBot latency: \`${ping}ms\`\nAPI latency: \`${client.ws.ping}ms\``
          )
          .setColor(client.config.color),
      ],
    });
  },
};
