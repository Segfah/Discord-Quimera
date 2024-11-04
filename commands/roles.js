const { t } = require('./../locales/locales');

module.exports = {
    name: 'roles',
    description: 'Muestra cada rol del servidor y los usuarios que tienen ese rol, excluyendo @everyone y el rol del bot.',
    run: async (message, args, language) => {
        // Identificamos el rol del bot
        const botRole = message.guild.members.me.roles.botRole;

        // Obtenemos todos los roles del servidor, excluyendo @everyone, roles vacíos, y el rol del bot
        const rolesInfo = message.guild.roles.cache
            .filter(role => role.members.size > 0 && role.id !== message.guild.id && role.id !== botRole.id)
            .map(role => {
                // Obtener el nombre de los miembros que tienen el rol
                const membersWithRole = role.members.map(member => member.user.username).join(', ');
                return `**${role.name}**: ${membersWithRole || t(language, 'commands.roles.noMembers')}`;
            })
            .join('\n');

        // Enviamos la lista como respuesta
        await message.reply(rolesInfo || t(language, 'commands.roles.noRoles'));
    },
};
