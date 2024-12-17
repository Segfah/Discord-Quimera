module.exports = (bot, db) => {
    bot.on('guildCreate', async (guild) => {

        const query = `
            INSERT INTO servers (serveur_name, serveur_id, creator_id, creator_name)
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
                console.error(`Error al registrar el nuevo servidor ${guild.name}:`, err.message);
            } else {
                console.log(`Nuevo servidor ${guild.name} registrado correctamente.`);
            }
        });
    });
};
