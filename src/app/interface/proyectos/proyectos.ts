import { Employee } from "../employee/employee";

export interface Proyecto {
  id:number;
  titulo:string;
  lider:Employee;
  descripcion:string;
  estado:string;
  createAt: Date;
  deleteAt: Date;
}