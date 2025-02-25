import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Actividad } from '../interface/actividades/actividades';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private API_URL = environment.API_URL + '/admincorp/activities';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  getActividad(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.API_URL, this.httpOptions);
  }
  public getActividadById(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.API_URL}/${id}/`);
  }

  createActividad(actividad: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(this.API_URL, actividad, this.httpOptions);
  }

  public updateActividad(actividad: Actividad): Observable<Actividad> {
    return this.http.put<Actividad>(
      `${this.API_URL}/update/${actividad.id}/`,
      actividad,
      this.httpOptions
    );
  }

  public deleteActividadById(actividadId: number): Observable<Actividad> {
    return this.http.delete<Actividad>(
      `${this.API_URL}/${actividadId}/`,
      this.httpOptions
    );
  }
}
