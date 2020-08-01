class Anuncio_Mascota extends Anuncio
{ 
    constructor(id:number, titulo:string, transaccion:string, descripcion:string, precio:string, animal:string, raza:string, fecha:string, vacuna:string, active = true)
    {
        super(id, titulo, transaccion, descripcion, precio);
    }
}