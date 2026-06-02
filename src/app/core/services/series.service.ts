import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // URL de tu backend

  // Llama al motor híbrido de Neo4j (protegido por JWT gracias a tu interceptor)
  getRecomendaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recomendaciones`);
  }

// Le agregamos "page: number = 1" para que sea dinámico
  getPopulares(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/series/populares?page=${page}`);
  }

  // Buscará series cuando usemos la barra superior
  buscarSeries(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/series/buscar?query=${query}`);
  }

  getDetalleSerie(idTmdb: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/series/${idTmdb}`);
  }
}