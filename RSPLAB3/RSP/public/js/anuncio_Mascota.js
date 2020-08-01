"use strict";
class Anuncio_Mascota extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, animal, raza, fecha, vacuna, active = true) {
        super(id, titulo, transaccion, descripcion, precio);
    }
}
