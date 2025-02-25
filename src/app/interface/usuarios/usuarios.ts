import { RoleEnum } from "../../enums/role";

export interface User {
  id:number;
  username: string;
  firstName: string;
  lastName: string
  password:string;
  role: RoleEnum
  createAt: Date;
  deleteAt: Date;
}