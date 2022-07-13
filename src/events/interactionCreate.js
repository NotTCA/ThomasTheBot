const client = require("../index");
const { MessageEmbed } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("That command no longer exists.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    try {
      await cmd.run(client, interaction, args);
    } catch (err) {
      console.error(err);
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription("Something went wrong.")
            .setColor(client.config.color),
        ],
        ephemeral: true,
      });
    }
  }
});
