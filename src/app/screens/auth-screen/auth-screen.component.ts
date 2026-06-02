import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black flex items-center justify-center p-4">
      <!-- Background -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="background-image: url('https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'); background-size: cover; background-position: center; filter: blur(8px);"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
      </div>

      <div class="relative w-full max-w-md bg-neutral-900/95 rounded-xl p-8 shadow-2xl border border-neutral-800">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-red-600 tracking-tight">NODEFLIX</h1>
          <p class="text-neutral-400 mt-2 text-sm">Tu plataforma de recomendaciones favorita</p>
        </div>

        <!-- Tabs -->
        <div class="flex bg-neutral-800 rounded-full p-1 mb-6">
          <button (click)="activeTab.set('login')"
            [class]="'flex-1 py-2.5 text-sm font-medium rounded-full transition-all ' +
              (activeTab() === 'login' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white')">
            Iniciar Sesión
          </button>
          <button (click)="activeTab.set('register')"
            [class]="'flex-1 py-2.5 text-sm font-medium rounded-full transition-all ' +
              (activeTab() === 'register' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white')">
            Registrarse
          </button>
        </div>

        <!-- Login Form -->
        @if (activeTab() === 'login') {
          <form (ngSubmit)="onLogin()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
              <input type="email" [(ngModel)]="email" name="email" placeholder="tu@email.com"
                class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Contraseña</label>
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••"
                class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
            </div>

            @if (showError()) {
              <div class="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Email o contraseña incorrectos</span>
              </div>
            }

            <button type="submit"
              class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              Iniciar Sesión
            </button>
          </form>
        }

        <!-- Register Form -->
        @if (activeTab() === 'register') {
          <form (ngSubmit)="onRegister()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Nombre completo</label>
              <input type="text" [(ngModel)]="fullName" name="fullName" placeholder="Tu nombre"
                class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
              <input type="email" [(ngModel)]="email" name="email" placeholder="tu@email.com"
                class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Contraseña</label>
              <input type="password" [(ngModel)]="password" name="password" placeholder="Mínimo 8 caracteres"
                class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1.5">Confirmar contraseña</label>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Repite tu contraseña"
                class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
            </div>
            <button type="submit"
              class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              Crear cuenta
            </button>
          </form>
        }
      </div>
    </div>
  `
})
export class AuthScreenComponent {
  private router = inject(Router);

  activeTab = signal<'login' | 'register'>('login');
  showError = signal(false);
  email = '';
  password = '';
  fullName = '';
  confirmPassword = '';

  onLogin() {
    // TODO: conectar con AuthService
    // Por ahora navega directo al onboarding
    this.router.navigate(['/onboarding/trailers']);
  }

  onRegister() {
    // TODO: conectar con AuthService
    this.router.navigate(['/onboarding/trailers']);
  }
}