class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje = 0) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }

    convertToJSON() {
        return JSON.stringify({
            vehicleType: this.vehicleType,
            date: this.date,
            kilometers: this.kilometers,
            precioViaje: this.precioViaje
        });
    }
}
export default GastoCombustible;