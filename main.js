const dotenv = require('dotenv');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { logError, logSuccess } = require('./logs/logs');

dotenv.config();

//const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const bot = new Client({ intents: 53608447 });

bot.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

const prefix = process.env.PREFIX || '!';

bot.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();
    const command = bot.commands.get(commandName);

    if (!command) return ;

    try {
        await command.run(message, args, 'es');
        logSuccess(commandName, message.author.tag, args);
    } catch (error) {
        logError(commandName, message.author.tag, args, error);
    }
});

bot.login(process.env.DISCORD_TOKEN);
