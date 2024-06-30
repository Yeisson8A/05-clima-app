//Importar DotEnv para manejo de variables de entorno
require('dotenv').config()
//Importar función para leer datos del usuario en consola
const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer");
//Importar clase para realizar operaciones de búsqueda ciudad
const Busquedas = require("./models/busquedas");

//Función principal de la aplicación
const main = async() => {
    let opt;
    const busquedas = new Busquedas();

    do {
        //Esperar y obtener la opción del usuario
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput("Ciudad: ");
                //Obtener listado de ciudades según término de búsqueda
                const lugares = await busquedas.ciudad(termino);
                //Mostrar listado de ciudades como menú interactivo
                const id = await listadoLugares(lugares);

                //Validar si la opción seleccionado es Cancelar
                if (id === "0") continue;

                //Obtener la información de la ciudad seleccionada según Id
                const lugarSel = lugares.find(l => l.id === id);
                //Guardar lugar consultado en historial
                busquedas.agregarHistorial(lugarSel.nombre);

                //Obtener información de clima para dicha ciudad
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.log("\nInformación de la ciudad\n".green)
                console.log("Ciudad: ", lugarSel.nombre.yellow)
                console.log("Lat: ", lugarSel.lat)
                console.log("Lng: ", lugarSel.lng)
                console.log("Temp: ", clima.temp)
                console.log("Min: ", clima.min)
                console.log("Máx: ", clima.max)
                console.log("Clima: ", clima.desc.yellow)
                break;
            case 2:
                //Recorrer historial
                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`)
                });
                break;
        }

        //Evaluar si la opción es igual a cero
        if(opt !== 0) await pausa();
    } while (opt !== 0);
}

//Llamar función principal de la aplicación
main();