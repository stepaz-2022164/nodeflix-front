import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/interacciones';

  getInteraccionesUsuario(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ¡NUEVO!: Método para enviar "Me Gusta", "Favorita", etc. al backend
  registrarInteraccion(idTmdb: number, tipoInteraccion: string): Observable<any> {
    // Mandamos el ID de la serie y el tipo de interacción en el cuerpo de la petición.
    // Recuerda que el ID del usuario viaja seguro y oculto en el Token gracias al Interceptor.
    return this.http.post(this.apiUrl, { idTmdb, tipoInteraccion });
  }
}