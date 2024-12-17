module.exports = (bot, db) => {
    bot.once('ready', async () => {
        const servers = bot.guilds.cache;

        for (const guild of servers.values()) {

            // Obtener todos los miembros del servidor, excluyendo bots
            const members = (await guild.members.fetch()).filter((member) => !member.user.bot);

            for (const member of members.values()) {
                const insertUserQuery = `
                    INSERT OR IGNORE INTO users (user_id, user_name)
                    VALUES (?, ?)
                `;

                const insertServerUserStatQuery = `
                    INSERT OR IGNORE INTO server_user_stats (server_id, user_id)
                    VALUES (
                        (SELECT id FROM servers WHERE serveur_id = ?),
                        (SELECT id FROM users WHERE user_id = ?)
                    )
                `;

                // Registrar al usuario en la tabla `users`
                db.run(insertUserQuery, [member.id, member.user.username], (err) => {
                    if (err) {
                        console.error(`Error al registrar al usuario ${member.user.username}:`, err.message);
                    } else {
                        console.log(`Usuario ${member.user.username} registrado correctamente.`);
                    }
                });

                // Asociar al usuario con el servidor en `server_user_stats` y asignar el rol
                db.run(insertServerUserStatQuery, [guild.id, member.id], (err) => {
                    if (err) {
                        console.error(`Error al asociar al usuario ${member.user.username} con el servidor ${guild.name}:`, err.message);
                    } else {
                        console.log(`Usuario ${member.user.username} asociado al servidor ${guild.name} correctamente.`);
                    }
                });
            }
        }
    });
};
