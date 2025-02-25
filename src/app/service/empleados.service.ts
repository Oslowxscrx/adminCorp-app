import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Employee } from '../interface/employee/employee';
import { environment } from '../../enviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private API_URL = environment.API_URL + '/admincorp/employees';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL, this.httpOptions);
  }

  getEmployeeByCedula(cedula: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/employees${cedula}`);
  }

  public getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, employee, this.httpOptions);
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.API_URL}/${employee.id}`,
      employee,
      this.httpOptions
    );
  }

  public deleteEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(
      `${this.API_URL}/${employeeId}`,
      this.httpOptions
    );
  }
}
