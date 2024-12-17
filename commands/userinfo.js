const { t } = require('./../locales/locales');

// Archivo: commands/userinfo.js
module.exports = {
    name: 'userinfo',
    description: 'Muestra información sobre un usuario especificado o sobre el usuario que ejecuta el comando.',
    run: async (message, args, language) => {
        // Determinar el usuario objetivo
        let targetUser;

        if (args.length > 0) {
            // Si hay un argumento, intenta obtener el usuario por mención o nombre
            targetUser = message.mentions.members.first() 
                         || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args[0].toLowerCase());

            if (!targetUser) {
                message.reply(t(language, 'commands.userinfo.error') + `: ${args[0]}`);
                throw new Error(t('en', 'commands.userinfo.error'));
            }
        } else {
            // Si no hay argumentos, usa el autor del mensaje
            targetUser = message.member;
        }

        // Extraer información del usuario
        const userInfo = `**` + t(language, 'commands.userinfo.response.user') + `:** ${targetUser.user.username}\n` +
        `**` + t(language, 'commands.userinfo.response.id') + `:** ${targetUser.user.id}\n` +
        `**` + t(language, 'commands.userinfo.response.createdIn') + `:** ${targetUser.user.createdAt}\n` +
        `**` + t(language, 'commands.userinfo.response.joinedAt') + `:** ${targetUser.joinedAt}\n` +
        `**` + t(language, 'commands.userinfo.response.roles') + `:** ${targetUser.roles.cache.map(role => role.name).join(', ')}`;
        
        // Responder con la información del usuario
        await message.reply(userInfo);
    },
};
