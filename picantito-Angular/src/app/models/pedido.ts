import { Producto } from "./producto"

export class Pedido {

    id?:number  
    precio?:number  
    precioDeAdquisicion?:number  
    fechaEntrega?:Date    
    fechaSolicitud?:Date    
    estado?:String  
    direccion?:String  
    cliente?:any     
    repartidor?:any 
    productos?: Map<Producto, number>;
    
}
