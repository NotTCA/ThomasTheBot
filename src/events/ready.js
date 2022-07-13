const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.tag} should now be online!`);
});
