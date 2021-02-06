const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const backups = JSON.parse(fs.readFileSync("./backups/backups.json", "utf8"));
const save = require("../utils/save.js");

module.exports = {
  name: "purgebackup",
  alias: ["pb"],
  run: async (client, message, args) => {
    let errorEmbed = new MessageEmbed()
    .setTitle(`Error`)
    .setDescription(`Aún no has hecho un backup de ningún servidor.`)
    .setColor("RED");
    
    if (!backups[message.author.id]) return message.channel.send(errorEmbed);
    
    let advertenciaEmbed = new MessageEmbed()
    .setTitle(`Advertencia`)
    .setColor("PURPLE")
    .setDescription(`¿Estás seguro de que quieres eliminar todos tus backups?\n__¡Esto no se puede deshacer!__`)
    .setTimestamp();
    
    message.channel.send(advertenciaEmbed).then(msg => {
      msg.react("✅");
      msg.react("❌");
      
      let siFilter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
      let noFilter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id;
      
      let si = msg.createReactionCollector(siFilter, { time: 0 });
      let no = msg.createReactionCollector(noFilter, { time: 0 });
      
      si.on('collect', r => {
        delete backups[message.author.id];
        save();

        let deletedSuccess = new MessageEmbed()
        .setDescription(`Eliminó con éxito todos sus backups.`)
        .setColor("GREEN");
        message.channel.send(deletedSuccess);
        
        msg.delete();
      })
    });
  }
}