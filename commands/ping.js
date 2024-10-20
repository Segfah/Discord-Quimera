const errorMessages ='El comando "!ping" no acepta argumentos adicionales.';

module.exports = {
    name: 'ping',
    description: 'Responde con "Pong!" cuando se usa el comando.',
    run: async (message, args) => {
        if (args.length > 0) {
            message.reply(errorMessages);
            throw new Error(errorMessages);
        }

        await message.reply('Pong!');
    },
};
