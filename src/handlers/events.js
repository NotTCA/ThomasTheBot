const fs = require("fs");
module.exports = async (client) => {
  const eventFiles = fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    try {
      let eventName = file.split(".")[0];
      require(`../events/${file}`);
    } catch (e) {
      console.error(e);
    }
  }
};
