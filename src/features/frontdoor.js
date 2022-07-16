const { Client, MesssageEmbed, MessageEmbed } = require("discord.js");

function ordinalSuffix(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.get(
      client.config.channels.frontdoor
    );

    if (!channel) return;

    channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `Welcome ${member.user.username}!`,
            iconURL: member.guild.iconURL({
              dynamic: true,
            }),
          })
          .setDescription(
            `We are happy to see you join **${
              member.guild.name
            }**!\nYou are the **${ordinalSuffix(
              member.guild.memberCount
            )}** member!\nPlease make sure to read the <#${
              client.config.channels.rules
            }>.`
          )
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setColor(client.config.color),
      ],
    });

    member.roles.add(member.guild.roles.cache.get(client.config.roles.member));
  });

  client.on("guildMemberRemove", (member) => {
    const channel = member.guild.channels.cache.get(
      client.config.channels.leave
    );

    if (!channel) return;

    channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(`${member.user.username} has left the server.`)
          .setColor(client.config.color),
      ],
    });
  });
};
