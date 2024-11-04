const { t } = require('./../locales/locales');

module.exports = {
    name: 'setlanguage',
    description: 'Establece el idioma del bot para el servidor interactuando con emojis.',
    run: async (message, args, language) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply(t(language, 'commands.setlanguage.noPermissions'));
        }

        const languageEmojis = {
            '🇪🇸': 'es', 
            '🇪🇺': 'en', 
            '🇫🇷': 'fr'  
        };

        const languageMessage = await message.reply(t(language, 'commands.setlanguage.chooseLanguage'));
        for (const emoji of Object.keys(languageEmojis)) {
            await languageMessage.react(emoji);
        }

        const filter = (reaction, user) => {
            return Object.keys(languageEmojis).includes(reaction.emoji.name) && user.id === message.author.id;
        };

        return languageMessage.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                const selectedLanguage = languageEmojis[reaction.emoji.name];

                message.reply(t(selectedLanguage, 'commands.setlanguage.success'));
                languageMessage.delete();
                return selectedLanguage;
            })
            .catch(() => {
                message.reply(t(language, 'commands.setlanguage.timeout'));
                languageMessage.delete();
                return language;
            });
    },
};
