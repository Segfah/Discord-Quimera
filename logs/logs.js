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
function logError(command, user, listArgs, error) {
    const logMessage = `--------------------------------------------------------------\n` +
                       `Date: ${getFormattedDate()}\n` +
                       `Command "${command}" executed by ${user}.\n` +
                       `Argumentos: [${listArgs}]\n` +
                       `${error.stack}\n`;

    fs.appendFileSync(errLogPath, logMessage, 'utf8');
}

// Función para guardar un log de éxito
function logSuccess(command, user, listArgs) {
    const logMessage = `--------------------------------------------------------------\n` +
                       `Date: ${getFormattedDate()}\n` +
                       `Command "${command}" executed by ${user}.\n` +
                       `Argumentos: [${listArgs}]\n`;

    fs.appendFileSync(sucLogPath, logMessage, 'utf8');
}

module.exports = { logError, logSuccess };
