const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname);
const errLogPath = path.join(logsDir, 'errLog');
const sucLogPath = path.join(logsDir, 'sucLog');

// Función para obtener la fecha y hora formateada en hora local
function getFormattedDate() {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset*60*1000));
    return localDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
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
