const fs = require('fs');
const path = require('path');

const locales = {};

// Cargar los archivos de traducción
const localesPath = __dirname;
const localeFiles = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));

for (const file of localeFiles) {
    const localeName = file.split('.')[0];
    locales[localeName] = require(path.join(localesPath, file));
}

// Función para obtener un mensaje traducido
function t(language, key, placeholders = {}) {
    const keys = key.split('.');
    let translation = locales[language];

    for (const keyPart of keys) {
        if (!translation[keyPart]) {
            return key; // Retornar la clave si no se encuentra traducción
        }
        translation = translation[keyPart];
    }

    // Reemplazar los placeholders en el mensaje
    for (const [placeholder, value] of Object.entries(placeholders)) {
        translation = translation.replace(`{${placeholder}}`, value);
    }

    return translation;
}

module.exports = { t };
