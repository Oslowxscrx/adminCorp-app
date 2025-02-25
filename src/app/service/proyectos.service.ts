import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Proyecto } from '../interface/proyectos/proyectos';
import { environment } from '../../enviroments/enviroments';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private API_URL = environment.API_URL + '/admincorp/proyects';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.API_URL, this.httpOptions);
  }

  getProyectoById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.API_URL}/proyectos${id}`);
  }

  createProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.API_URL, proyecto, this.httpOptions);
  }

  public updateProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.put<Proyecto>(
      `${this.API_URL}/${proyecto.id}`,
      proyecto,
      this.httpOptions
    );
  }

  public deleteProyectoById(proyectoId: number): Observable<Proyecto> {
    return this.http.delete<Proyecto>(
      `${this.API_URL}/${proyectoId}`,
      this.httpOptions
    );
  }
}
