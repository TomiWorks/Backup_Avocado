const { MessageEmbed } = require("discord.js");
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
      let id = createBackupID(16);
      console.log(id)
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
      
      let md = new MessageEmbed()
      .setTitle('Backup finalizado')
      .setDescription(`Revisa tus mensajes privados!!`)
      .setColor("GREEN");
      
      message.author.send(resultado);
      m.edit(md);

      return true;
    }).catch(c => {
      console.log(c)
    });
  }
}

function createBackupID(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result;
}

function save() {
  fs.writeFile("./backups/backups.json", JSON.stringify(backups), err => {
    if (err) console.error(err);
  });
}