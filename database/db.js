const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./Quimera_bot_discord.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conexión exitosa con SQLite.');
    }
});

// Exportar la conexión
module.exports = db;
