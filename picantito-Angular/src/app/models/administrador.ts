import { Usuario } from './usuario'; // Importando Usuario desde la carpeta 'models'

export class Administrador implements Usuario {
    id?:number
    nombreCompleto?:String  
    nombreUsuario?:String  
    telefono?:String  
    correo?:String  
    contrasenia?:String  

}
