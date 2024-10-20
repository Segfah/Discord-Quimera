const dotenv = require('dotenv');
const discord = require('discord.js'); 

dotenv.config();

const bot = new discord.Client({ intents: [discord.GatewayIntentBits.Guilds] });


console.log("Bienvenido a mi bot");
bot.login(process.env.DISCORD_TOKEN);
