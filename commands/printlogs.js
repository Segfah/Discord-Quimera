/*
 Crear 2 funciones
 1) imprimir los ultimos 5 logs de error
 2) imprimir los ultimos 5 logs de éxito.
 (opcional) Crear una función que imprima los logs deseados, con un argumento, ver ejemplo de uso

 uso:
    !printlogs error 2
    !printlogs success 3
*/

module.exports = {
    name: 'printlogs',
    description: 'Imprime los logs de error o de éxito',
    run: async (message, args, language) => {
        await message.reply("incompleto");
    },
};
