const Discord = require("discord.js");
require("dotenv/config");
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  restTimeOffset: 0,
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  presence: {
    activities: [
      {
        name: "trains",
        type: "WATCHING",
      },
    ],
  },
});
module.exports = client;

client.config = require("../config.json");
client.emotes = require("../emojis.json");
client.slashCommands = new Discord.Collection();
client.voiceGenerator = new Discord.Collection();

["commands", "events", "features"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);
