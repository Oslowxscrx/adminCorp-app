import { User } from "../usuarios/usuarios";

export interface Proyecto {
  id:number;
  titulo:string;
  leader:User;
  descripcion:string;
  estado:string;
  color?: string;
  createAt: Date;
  deleteAt: Date;
}