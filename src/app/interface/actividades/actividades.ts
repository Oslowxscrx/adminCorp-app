import { User } from "../usuarios/usuarios";

export interface Actividad {
  id:number;
  nombreActividad:string;
  staff:User;
  descripcion:string;
  estado:string;
  tiempoEntrega:string;
  color?: string;
  createAt: Date;
  deleteAt: Date;
}