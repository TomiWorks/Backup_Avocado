const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const hastebins = require("hastebin-gen");
const createBackupID = require("../utils/createBackupID.js");
const save = require("../utils/save.js");
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
      let id = createBackupID(16);
      const channels = message.guild.channels.cache.sort(function(a, b) {
        return a.position - b.position;
      }).array().map(c => {
        const channel = {
          name: c.name,
          position: c.position,
          type: c.type
        };
        if(c.parent) channel.parent = c.parent.name;
        return channel;
      });
      
      const roles = message.guild.roles.cache.filter(r => r.name !== "@everyone").sort(function(a, b) {
        return a.position - b.position;
      }).array().map(r => {
        const role = {
          color: r.color,
          hoist: r.hoist,
          name: r.name,
          mentionable: r.mentionable,
          permissions: r.permissions,
          position: r.position
        };
        return role;
      });
      
      if (!backups[message.author.id]) backups[message.author.id] = {};
      backups[message.author.id][id] = {
        channels,
        createdAt: message.guild.createdAt,
        icon: message.guild.iconURL(),
        members: message.guild.memberCount,
        name: message.guild.name,
        owner: message.guild.ownerID,
        roles,
      };
      
      save();
      
      let resultado = new MessageEmbed()
      .setTitle('Backup finalizado')
      .setDescription(`Backup de **${message.guild.name}** creado con la ID \`${id}\``)
      .addField("Uso", `\`\`\`.loadbackup ${id}\`\`\`
      \`\`\`b!backup info ${id}\`\`\``)
      .setColor("GREEN");
      
      message.author.send(resultado);
      m.edit('Revisa tus mensajes privados!!');

      return true;
    });
  }
}