const { t } = require('./../locales/locales');
const path = require('path');
const fs = require('fs');

const commandsPath = path.join(__dirname);
const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js') && file !== 'help.js');

let commands = [{
    name: 'help',
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
    name: 'help',
    description: 'Muestra todos los comandos y tambien su forma de uso si hay un argumento',
    run: async (message, args, language) => {
        console.log(args.length);
        if (args.length !== 1 && args.length !== 0) {
            message.reply(t(language, 'commands.help.ArgsError'));
            throw new Error(t('en', 'commands.help.ArgsError'));
        }
        if (args.length === 1) {
            const foundCommand = commands.find(cmd => cmd.name === args[0]);
            if (!foundCommand) {
                message.reply(t(language, 'commands.help.error'));
                throw new Error(t('en', 'commands.help.error'));
            }
            await message.reply(t(language, `commands.help.response.${args[0]}`));
        }
        else {
            let commandList = commands
                .map(cmd => `!${cmd.name} - ${t(language, `commands.${cmd.name}.description`)}`)
                .join('\n');
            commandList += `\n\n${t(language, 'commands.help.footer')}`;
            await message.reply(commandList);
        }
    }
};
