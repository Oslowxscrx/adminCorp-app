import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { Area } from '../interface/area/area';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private API_URL = environment.API_URL + '/admincorp/areas';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.API_URL, this.httpOptions);
  }

  public getAreaById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.API_URL}/${id}`);
  }

  createArea(area: Area): Observable<Area> {
    return this.http.post<Area>(this.API_URL, area, this.httpOptions);
  }

  public updateArea(area: Area): Observable<Area> {
    return this.http.put<Area>(
      `${this.API_URL}/${area.id}`,
      area,
      this.httpOptions
    );
  }

  public deleteAreaById(areaId: number): Observable<Area> {
    return this.http.delete<Area>(
      `${this.API_URL}/${areaId}`,
      this.httpOptions
    );
  }
}
