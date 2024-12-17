const { t } = require('./../locales/locales');
const path = require('path');
const fs = require('fs');

const commandsPath = path.join(__dirname);
const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js') && file !== 'menu.js'); // Evitar que cargue su propio archivo

let commands = [{
    name: 'menu',
    description: 'Muestra todos los comandos'
}];

// Cargar los comandos y sus descripciones
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push({
        name: command.name,
        description: command.description
    });
}

module.exports = {
    name: 'menu',
    description: 'Muestra todos los comandos',
    run: async (message, args, language) => {
        // Construir el mensaje con todos los comandos y descripciones
        const commandList = commands
            .map(cmd => `!${cmd.name} - ${cmd.description}`)
            .join('\n');

        await message.reply(commandList);
    },
};
