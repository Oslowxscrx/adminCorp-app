import { User } from "../usuarios/usuarios";

export interface Actividad {
  id:number;
  nombreActividad:string;
  asignado:User;
  descripcion:string;
  estado:string;
  tiempoEntrega:Date;
  color?: string;
  createAt: Date;
  deleteAt: Date;
}