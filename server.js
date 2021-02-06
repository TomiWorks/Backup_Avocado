const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const prefix = '.';

client.on('ready', () => {
  console.log('ready')
});

client.on('message', async (message) => {
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  if(message.channel.type === "dm") return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
  
  if(!command) return;
  
  try {
    command.run(client, message, args);
  } catch (err) {
    console.log(err);
    message.channel.send('error')
  }
});

client.login('tu token')