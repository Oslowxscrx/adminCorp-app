import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../../interface/usuarios/usuarios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroments';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private API_URL = environment.API_URL + '/admincorp/users'; // Aquí se concatena la ruta específica para los usuarios

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL, this.httpOptions);
  }

  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.API_URL, user, this.httpOptions);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(
      `${this.API_URL}/${user.id}`,
      user,
      this.httpOptions
    );
  }

  public deleteUserById(userId: number): Observable<User> {
    return this.http.delete<User>(
      `${this.API_URL}/${userId}`,
      this.httpOptions
    );
  }
}
