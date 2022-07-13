const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = async (client) => {
  const commands = [];

  fs.readdirSync("./src/commands/").forEach((directory) => {
    const commandFiles = fs
      .readdirSync(`./src/commands/${directory}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../commands/${directory}/${file}`);
      commands.push(command.data.toJSON());
      client.slashCommands.set(command.data.toJSON().name, command);
    }
  });

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  try {
    console.log("Reloading slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        client.config.clientId,
        client.config.guildId
      ),
      {
        body: commands,
      }
    );

    console.log("Reloaded slash commands.");
  } catch (error) {
    console.error(error);
  }
};
