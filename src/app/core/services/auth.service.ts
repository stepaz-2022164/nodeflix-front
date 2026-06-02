import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Asegúrate de que esta sea la URL de tu backend de Node.js
  private apiUrl = 'http://localhost:3000/api/user'; 

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        }
      })
    );
  }

  registro(nombre: string, correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, { nombre, correo, password });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}