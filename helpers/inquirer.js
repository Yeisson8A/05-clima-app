//Libreria inquirer para aplicación consola interactivo
const inquirer = require("inquirer");
//Libreria para dar color a texto de consola
const colors = require("colors");

const preguntas = [
    {
        type: "list",
        name: "opcion",
        message: "¿Qué desea hacer?",
        choices: [
            {
                value: 1,
                name: `${"1.".green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${"2.".green} Historial`
            },
            {
                value: 0,
                name: `${"0.".green} Salir`
            }
        ]
    }
]

//Función para crear menú interactivo
const inquirerMenu = async() => {
    console.clear();
    console.log("==========================================".green);
    console.log("Seleccione una opción".white);
    console.log("==========================================\n".green);
    //Menú interactivo
    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}

//Función para pausar ejecución antes de volver a mostrar el menú en caso de aplicar
const pausa = async() => {
    const question = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${"ENTER".green} para continuar`
        }
    ]

    console.log("\n");
    await inquirer.prompt(question);
}

//Función para leer datos de consola ingresados por el usuario
const leerInput = async(message) => {
    const question = [
        {
            type: "input",
            name: "desc",
            message,
            validation(value){
                if (value.length === 0) {
                    return "Por favor ingrese un valor"
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

//Función para mostrar listado de ciudades como un menú interactivo
const listadoLugares = async(lugares = []) => {
    //Usar map para generar opciones del menú según las ciudades
    const choices = lugares.map((lugar, i) => {
        //Indice de la tarea
        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    //Agregar opción por defecto al inicio del menú
    choices.unshift({
        value: "0",
        name: `${"0.".green} Cancelar`
    });

    //Opciones del menú
    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Seleccione lugar: ",
            choices
        }
    ]

    //Menú interactivo
    const {id} = await inquirer.prompt(preguntas);
    return id;
}

//Función para confirmar una operación
const confirmar = async(message) => {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message
        }
    ];

    const {ok} = await inquirer.prompt(question);
    return ok;
}

//Función para mostrar listado de tareas como un menú interactivo a fin de completarlas
const mostrarListadoChecklist = async(tareas = []) => {
    //Usar map para generar opciones del menú según las tareas
    const choices = tareas.map((tarea, i) => {
        //Indice de la tarea
        const idx = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    //Opciones del menú
    const pregunta = [
        {
            type: "checkbox",
            name: "ids",
            message: "Borrar",
            choices
        }
    ]

    //Menú interactivo
    const {ids} = await inquirer.prompt(pregunta);
    return ids;
}

//Exportar funciones
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    confirmar,
    mostrarListadoChecklist
}