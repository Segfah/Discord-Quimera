const dotenv = require('dotenv');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { logError, logSuccess } = require('./logs/logs');
const db = require('./database/db');

dotenv.config();

const bot = new Client({ intents: 53608447 });
const languages = {}; // Objeto para almacenar el idioma de cada servidor

bot.commands = new Collection();

// --------------------------------------------- //
//                Cargar idiomas                 //
// --------------------------------------------- //
bot.once('ready', async () => {
    console.log('Cargando idiomas de los servidores...');
    db.all(`SELECT serveur_id, language FROM servers`, (err, rows) => {
        if (err) {
            console.error('Error al cargar idiomas desde la base de datos:', err.message);
        } else {
            rows.forEach(row => {
                languages[row.serveur_id] = row.language || 'en'; // Por defecto 'en' si no tiene idioma asignado
            });
        }
    });

    console.log(`${bot.user.username} está en línea.`);
});

// --------------------------------------------- //
//            Cargar eventos dinámicos           //
// --------------------------------------------- //
const eventServerFiles = fs.readdirSync('./events/server').filter((file) => file.endsWith('.js'));
const eventMemberFiles = fs.readdirSync('./events/member').filter((file) => file.endsWith('.js'));

for (const file of eventServerFiles) {
    const event = require(`./events/server/${file}`);
    event(bot, db); // Pasar el bot y la base de datos a cada evento del servidor
}

for (const file of eventMemberFiles) {
    const event = require(`./events/member/${file}`);
    event(bot, db); // Pasar el bot y la base de datos a cada evento de los miembros
}

// --------------------------------------------- //
//                  Cargar comandos              //
// --------------------------------------------- //
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

    if (!command) return;

    try {
        // Identificar el idioma actual del servidor
        const currentLanguage = languages[message.guild.id] || 'en';

        // Ejecutar el comando, pasando el idioma y la base de datos
        const result = await command.run(message, args, currentLanguage, db, languages);

        // Si se ejecuta `setlanguage`, actualizar el idioma en memoria
        if (commandName === 'setlanguage' && result) {
            languages[message.guild.id] = result; // Actualizar en memoria
        }

        logSuccess(commandName, message.author.tag, args);
    } catch (error) {
        logError(commandName, message.author.tag, args, error);
    }
});

bot.login(process.env.DISCORD_TOKEN);

// --------------------------------------------- //
//         Cerrar conexión con la base de datos  //
// --------------------------------------------- //
process.on('SIGINT', () => {
    console.log('Cerrando conexión con la base de datos...');
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('Conexión con SQLite cerrada.');
        }
        process.exit(0);
    });
});
