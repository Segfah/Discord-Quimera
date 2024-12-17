module.exports = (bot, db) => {
    bot.on('guildMemberAdd', async (member) => {
        if (member.user.bot) return;

        // Consulta para insertar al usuario en la tabla `users`
        const insertUserQuery = `
            INSERT OR IGNORE INTO users (user_id, user_name)
            VALUES (?, ?)
        `;

        // Consulta para asociar al usuario con el servidor en `server_user_stats`
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

        // Asociar al usuario con el servidor en `server_user_stats`
        db.run(insertServerUserStatQuery, [member.guild.id, member.id], (err) => {
            if (err) {
                console.error(`Error al asociar al usuario ${member.user.username} con el servidor ${member.guild.name}:`, err.message);
            } else {
                console.log(`Usuario ${member.user.username} asociado al servidor ${member.guild.name} correctamente.`);
            }
        });
    });
};
