import { Area } from "../area/area";

export interface Employee {
  id:number;
  cedula:number;
  nombreEmpleado:string;
  apellidoEmpleado:string;
  correoEmpleado:string;
  area: Area
  createAt: Date;
  deleteAt: Date;
}