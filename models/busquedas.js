//Libreria para manejar el file system
const fs = require('fs');
//Libreria para peticiones HTTP
const axios = require('axios');

class Busquedas {
    historial = []
    //Ruta y nombre del archivo donde se almacenará el historial
    dbPath = './db/database.json';

    constructor() {
        //Llamar método para leer archivo JSON con el historial
        this.leerDB();
    }

    get historialCapitalizado(){
        
    }

    //Método getter para obtener los parámetros a utilizar en MapBox
    get paramsMapbox(){
        return {
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5
        };
    }

    //Método getter para obtener los parámetros a utilizar en OpenWeather
    get paramsOpenweather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    //Método para consultar una ciudad
    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            //Llamar servicio usando Axios
            //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/juarez.json?language=es&access_token=pk.eyJ1IjoieWVpc3NvbjhhIiwiYSI6ImNrem9peHUzcTJjeXAydnM4ZWc4a2tiM2cifQ.wy22wZTpdQfjcvERQ0lMjw&limit=5');
            const resp = await instance.get();
            //Retornar listado de lugares coincidentes haciendo un mapeo a nuevo objeto
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            //Retornar listado vacío
            return [];
        }
    }

    //Método para consultar el clima de un lugar según su longitud y latitud
    async climaLugar(lat, lon){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenweather, lat, lon}
            })

            //Llamar servicio usando Axios
            const resp = await instance.get();
            //Retornar datos del clima
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        } catch (error) {
            console.log(error);
        }
    }

    //Método para agregar lugar consultado en historial
    agregarHistorial(lugar = ''){
        //Validar si el lugar consultado ya se encuentra en el historial
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        //Agregar lugar consultado a historial
        this.historial.unshift(lugar.toLowerCase());
        //Llamar método para guardar historial en archivo JSON
        this.guardarDB();
    }

    //Método para guardar historial con los lugares consultados en archivo JSON
    guardarDB(){
        const payload = {
            historial: this.historial
        };

        //Guardar objeto historial como objeto JSON
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    //Método para obtener información de lugares consultados para el historial
    leerDB(){
        //Validar si el archivo con el historial existe
        if (!fs.existsSync(this.dbPath)) {
            //Leer contenido del archivo JSON
            const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            //Convertir contenido leido del archivo en un objeto JSON
            const data = JSON.parse(info);
            //Adicionar listado con el historial a variable
            this.historial = data.historial;
        }
    }
}

//Exportar clase
module.exports = Busquedas;