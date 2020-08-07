import Anuncio from "./anuncio.js";
export default class Anuncio_Mascota extends Anuncio {
    constructor(id, titulo, transaccion = 'venta', descripcion, precio, animal, raza, fecha, vacuna, active = true) {
        super(id, titulo, transaccion, descripcion, precio);
        this.animal = animal;
        this.raza = raza;
        this.fecha = fecha;
        this.vacuna = vacuna;
        this.active = active;
    }
}
//# sourceMappingURL=anuncio_Mascota.js.map