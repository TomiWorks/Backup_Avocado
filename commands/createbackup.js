const { MessageEmbed, Client, Util, Message } = require("discord.js");
const fs = require("fs");
const hastebins = require("hastebin-gen");
const backups = JSON.parse(fs.readFileSync("./backups/backups.json", "utf8"));

module.exports = {
  name: "createbackup",
  alias: ["cb"],
  run: async (client, message, args) => {
    await message.guild.roles.cache.filter(r => r.name !== message.guild.me.roles.highest.name).forEach(r => {
      if (r.comparePositionTo(message.guild.me.roles.highest) > 0) {
        return message.channel.send(`No tengo el rol mas alto`);
      }
    });
    
    let creandoEmbed = new MessageEmbed()
    .setColor('PURPLE')
    .setTitle('Por favor espera...')
    .setTimestamp()
    .setDescription(`Creando backup`);
    
    message.channel.send(creandoEmbed).then(m => {
      
    })
  }
}