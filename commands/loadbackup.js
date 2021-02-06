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
        reason: 'Para cargar un backup.'
      }).then(r => {
        r.setPosition(r.position);
      });
    });
    
    await backups[message.author.id][args[0]].channels.filter(channels => channels.type === "category").forEach(async function(ch) {
      message.guild.channels.create(ch.name, { type: ch.type, permissionOverwrites: ch.permissionOverwrites, reason: "Para cargar un backup." });
    });
    
    await backups[message.author.id][args[0]].channels.filter(c => c.type !== "category").forEach(async function(ch) {
      message.guild.channels.create(ch.name, { type: ch.type }).then(c => {
        const parent = message.guild.channels.cache.filter(c => c.type === "category") .find(c => c.name === ch.parent);
        ch.parent ? c.setParent(parent) : "";
      });
    });
    
    await message.guild.setName(backups[message.author.id][args[0]].name);
    await message.guild.setIcon(backups[message.author.id][args[0]].icon);
  }
}