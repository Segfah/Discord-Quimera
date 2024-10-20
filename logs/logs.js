const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname);
const errLogPath = path.join(logsDir, 'errLog');
const sucLogPath = path.join(logsDir, 'sucLog');

// Función para obtener la fecha y hora formateada
function getFormattedDate() {
    const date = new Date();
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

// Función para guardar un log de error
function logError(command, user, args, error) {
    const logMessage = `--------------------------------------------------------------\n` +
                       `Fecha: ${getFormattedDate()}\n` +
                       `Comando "${command}" ejecutado por ${user}.\n` +
                       `Argumentos: ${JSON.stringify(args)}\n` +
                       `Error: ${error.stack}\n` +
                       `--------------------------------------------------------------\n`;

    fs.appendFileSync(errLogPath, logMessage, 'utf8');
}

// Función para guardar un log de éxito
function logSuccess(command, user, args) {
    const logMessage = `--------------------------------------------------------------\n` +
                       `Fecha: ${getFormattedDate()}\n` +
                       `Comando "${command}" ejecutado por ${user}.\n` +
                       `Argumentos: ${JSON.stringify(args)}\n` +
                       `--------------------------------------------------------------\n`;

    fs.appendFileSync(sucLogPath, logMessage, 'utf8');
}

module.exports = { logError, logSuccess };
