module.exports = (bot, db) => {
    bot.once('ready', async () => {
        const servers = bot.guilds.cache;

        for (const guild of servers.values()) {
            const query = `
                INSERT OR IGNORE INTO servers (serveur_name, serveur_id, creator_id, creator_name)
                VALUES (?, ?, ?, ?)
            `;

            const owner = await guild.fetchOwner();
            db.run(query, [
                guild.name,
                guild.id,
                guild.ownerId,
                owner.user.username
            ], (err) => {
                if (err) {
                    console.error(`Error al registrar el servidor ${guild.name}:`, err.message);
                } else {
                    console.log(`Servidor ${guild.name} registrado correctamente.`);
                }
            });
        }
    });
};
