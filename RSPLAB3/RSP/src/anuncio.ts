export default class Anuncio
{
    public id:number;
    public titulo:string;
    public transaccion:string;
    public descripcion:string;
    public precio:string;
    
    constructor(id:number, titulo:string, transaccion:string = 'venta', descripcion:string, precio:string)
    {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;
        this.precio = precio;
    }
}
