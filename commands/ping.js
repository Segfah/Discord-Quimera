const { t } = require('./../locales/locales');

module.exports = {
    name: 'ping',
    description: 'Responde con "Pong!" cuando se usa el comando.',
    run: async (message, args, language) => {
        if (args.length > 0) {
            message.reply(t(language, 'commands.ping.error'));
            throw new Error(t('en', 'commands.ping.error'));
        }
        await message.reply(t(language, 'commands.ping.response'));
    },
};
