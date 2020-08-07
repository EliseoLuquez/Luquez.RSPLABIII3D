import Anuncio from "./anuncio.js";
export default class Anuncio_Mascota extends Anuncio
{
    public animal:string;
    public raza:string;
    public fecha:string;
    public vacuna:string;
    public active:boolean;
    
    constructor(id:number, titulo:string, transaccion:string = 'venta', descripcion:string, precio:string, animal:string, 
                    raza:string, fecha:string, vacuna:string, active:boolean = true)
    {
        super(id, titulo, transaccion, descripcion, precio);
        this.animal = animal;
        this.raza = raza;
        this.fecha = fecha;
        this.vacuna = vacuna;
        this.active = active;
    }
}