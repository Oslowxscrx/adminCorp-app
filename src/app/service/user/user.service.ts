import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { User } from '../../interface/usuarios/usuarios';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = environment.API_URL + 'users';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl,
    this.httpOptions);
  }

  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }


  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  public updateUsuario(usuario: User): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${usuario.id}`,
      usuario,
      this.httpOptions
    );
  }

  deleteUser(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}