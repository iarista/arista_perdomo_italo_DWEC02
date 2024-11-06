import GastoCombustible from "../models/GastoCombustible.js";
// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'data/tarifasCombustible.json';
let gastosJSONpath = 'data/gastosCombustible.json';




// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    gastosJSON.forEach(gasto => {
        const year = new Date(gasto.date).getFullYear();
        if (aniosArray.hasOwnProperty(year)) {
            aniosArray[year] += gasto.precioViaje;
        }
    });

    for (let year in aniosArray) {
        document.getElementById(`gasto${year}`).textContent = aniosArray[year].toFixed(2);
    }

    
}



// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const year = fecha.getFullYear();
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    
    // Calcula el precio usando la tarifa según el tipo de vehículo 
    const tarifa = tarifasJSON.tarifas.find(t =>t.anio === year);
    const precioViaje = tarifa ? tarifa.vehiculos[tipoVehiculo] * kilometros : 0;

    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);
    
    // Actualizar visualización de gastos recientes
    const expenseList = document.getElementById('expense-list');
    const li = document.createElement('li');
    li.textContent = nuevoGasto.convertToJSON();
    expenseList.appendChild(li);

    // Actualizar el gasto total para el año correspondiente en el DOM
    const gastoElement = document.getElementById(`gasto${year}`);

    // Obtener el gasto actual desde el DOM y sumar el nuevo precio del viaje
    const gastoActual = parseFloat(gastoElement.textContent) || 0;
    const nuevoGastoTotal = gastoActual + precioViaje;
    gastoElement.textContent = nuevoGastoTotal.toFixed(2);

    // // Actualizar el gasto total por año
    // const year = fecha.getFullYear();
    // aniosArray[year] += precioViaje;
    // document.getElementById(`gasto${year}`).textContent = aniosArray[year].toFixed(2);

    // Limpiar formulario
    document.getElementById('fuel-form').reset();


}

