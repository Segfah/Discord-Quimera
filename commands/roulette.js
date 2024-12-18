const { t } = require('./../locales/locales');

module.exports = {
    name: 'roulette',
    description: 'Sortea un ganador entre los participantes.',
    run: async (message, args, language) => {
        // Validar argumento: debe ser un número positivo
        if (args.length !== 1 || isNaN(args[0]) || Number(args[0]) <= 0) {
            message.reply(t(language, 'commands.roulette.invalid_time'));
            return new Error(t('en', 'commands.roulette.invalid_time'));
        }

        const timeInMinutes = Number(args[0]);
        const timeInMilliseconds = timeInMinutes * 60 * 1000;

        const emoji = '🎰';
        const emojiList = {
            'congratulations': '🎉',
            'happy': '😄',
            'champagne': '🍾',
            'party': '🎊',
            'fireworks': '🎆',
            'sparkles': '✨',
            'star': '⭐',
            'trophy': '🏆',
            'clap': '👏',
            'medal': '🎖️',
        };

        const UserList = new Set();

        const messageRoulette = await message.reply(
            t(language, 'commands.roulette.participate', { time: timeInMinutes })
        );

        await messageRoulette.react(emoji);

        const filter = (reaction, user) => {
            return reaction.emoji.name === emoji && !user.bot;
        };

        const collector = messageRoulette.createReactionCollector({
            filter,
            time: timeInMilliseconds,
            dispose: true, // Permitir que los usuarios se retiren (The Collector#remove and Collector#dispose events need to be enabled by providing dispose: true as a CollectorOption.)
        });

        // Manejar eventos del recolector
        collector.on('collect', (reaction, user) => {
            UserList.add(user.username);
        });

        collector.on('remove', (reaction, user) => {
            UserList.delete(user.username);
        });

        collector.on('end', async () => {
            messageRoulette.delete();
            const participants = Array.from(UserList);
            if (participants.length === 0) {
                return message.reply(t(language, 'commands.roulette.no_participants'));
            }

            const UserWinner = participants[Math.floor(Math.random() * participants.length)];

            let reponseWinners = t(language, 'commands.roulette.participants') + ': ' + participants.join(', ') + '\n';
            reponseWinners += t(language, 'commands.roulette.winner') + ': ' + UserWinner + '\n';
            reponseWinners += t(language, 'commands.roulette.congratulations') + '\n';

            const reponse = await message.reply(reponseWinners);

            for (const emoji of Object.values(emojiList)) {
                if (emoji) {
                    await reponse.react(emoji);
                }
            }
        });
    },
};
