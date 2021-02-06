const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const backups = JSON.parse(fs.readFileSync("./backups/backups.json", "utf8"));

module.exports = {
  name: "deletebackup",
  alias: ["db"],
  run: async (client, message, args) => {
    //console.log(backups[message.author.id][args[0]] ? 'pvto' : 'no')
    
    if(!args[0]) return message.channel.send(`Debe proporcionar el ID del backup.`);
    if(!backups[message.author.id][args[0]]) return message.channel.send(`No tienes ningún un backup con esa ID.`);
    
    delete backups[message.author.id][args[0]];
    save();
    
    let eliminado = new MessageEmbed()
    .setTitle(`Backup eliminadp correctamente`)
    .setDescription(`El backup con esa ID fue eliminado con éxito.`)
    .setColor("GREEN");
    
    message.channel.send(eliminado);
  }
}

function save() {
  fs.writeFile("./backups/backups.json", JSON.stringify(backups), err => {
    if (err) console.error(err);
  });
}