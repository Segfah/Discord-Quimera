const { t } = require('./../locales/locales');

module.exports = {
    name: 'setlanguage',
    description: 'Establece el idioma del bot para el servidor interactuando con emojis.',
    run: async (message, args, currentLanguage, db, languages) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply(t(currentLanguage, 'commands.setlanguage.noPermissions'));
        }

        const serverId = message.guild.id;

        // Emojis y sus idiomas asociados
        const languageEmojis = {
            '🇪🇸': 'es',
            '🇪🇺': 'en',
            '🇫🇷': 'fr'
        };

        const languageMessage = await message.reply(t(currentLanguage, 'commands.setlanguage.chooseLanguage'));
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

                // Actualizar idioma en la base de datos
                if (selectedLanguage == currentLanguage) {
                    return message.reply(t(currentLanguage, 'commands.setlanguage.alreadySet'));
                }
                db.run(`UPDATE servers SET language = ? WHERE serveur_id = ?`, [selectedLanguage, serverId], (err) => {
                    if (err) {
                        console.error('Error al actualizar la base de datos', err.message);
                        return message.reply(t(currentLanguage, 'db.error'));
                    } else {
                        // Actualizar idioma en memoria
                        languages[serverId] = selectedLanguage;
                        message.reply(t(selectedLanguage, 'commands.setlanguage.success'));
                    }
                });

                languageMessage.delete();
                return selectedLanguage;
            })
            .catch(() => {
                message.reply(t(currentLanguage, 'commands.setlanguage.timeout'));
                languageMessage.delete();
                return currentLanguage;
            });
    },
};
