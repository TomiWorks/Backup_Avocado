const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const backups = JSON.parse(fs.readFileSync("./backups/backups.json", "utf8"));

module.exports = {
  name: "loadbackup",
  alias: ["lb"],
  run: async (client, message, args) => {
    if(!args[0]) return message.channel.send(`Debe proporcionar el ID del backup.`);
    if(!backups[message.author.id][args[0]]) return message.channel.send(`No tienes ningún un backup con esa ID.`);
    
    message.guild.channels.cache.forEach(c => {
      c.delete('Para cargar un backup.');
    });
    
    message.guild.roles.cache.filter(r => r.members.every(m => !m.user.bot)).forEach(r => {
      r.delete('Para cargar un backup.');
    });
    
    await backups[message.author.id][args[0]].roles.forEach(async function(role) {
      message.guild.roles.create({
        data: {
          color: role.color,
          hoist: role.hoist,
          mentionable: role.mentionable,
          name: role.name,
          permissions: role.permissions,
          position: role.position
        },
        reason: ""
      })
    })
  }
}