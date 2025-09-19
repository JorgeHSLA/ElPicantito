
import { Usuario } from './usuario';
export class Repartidor implements Usuario {

    id?:number
    nombreCompleto?:String  
    nombreUsuario?:String  
    telefono?:String  
    correo?:String  
    contrasenia?:String  
    estado?:String  
    pedidosRepartidor?:any[]

}
