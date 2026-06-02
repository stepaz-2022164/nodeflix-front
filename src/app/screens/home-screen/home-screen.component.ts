import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Serie {
  id: number;
  tmdbId: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Navbar -->
      <nav class="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
              <span class="text-2xl font-bold text-red-600 cursor-pointer"
                (click)="router.navigate(['/home'])">NODEFLIX</span>
              <div class="hidden md:flex items-center gap-6">
                <a class="text-white font-medium cursor-pointer">Inicio</a>
                <a class="text-neutral-400 hover:text-white transition-colors cursor-pointer">Series</a>
                <a class="text-neutral-400 hover:text-white transition-colors cursor-pointer">Mi Lista</a>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Search -->
              <div class="relative">
                @if (searchActive()) {
                  <div class="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                    <svg class="w-5 h-5 text-neutral-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input type="text" [(ngModel)]="searchQuery"
                      placeholder="Títulos, géneros..."
                      class="w-48 md:w-64 px-3 py-2 bg-transparent text-white placeholder-neutral-500 focus:outline-none">
                    <button (click)="toggleSearch()" class="p-2 text-neutral-400 hover:text-white">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                } @else {
                  <button (click)="toggleSearch()" class="p-2 text-neutral-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </button>
                }
              </div>
              <!-- Profile -->
              <div class="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center cursor-pointer">
                <span class="text-white text-sm font-semibold">U</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Banner -->
      <div class="relative h-[70vh] overflow-hidden">
        <img src="https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"
          alt="Stranger Things" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 max-w-2xl">
          <span class="inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded mb-4">Recomendado</span>
          <h1 class="text-5xl font-bold text-white mb-4">Stranger Things</h1>
          <p class="text-lg text-neutral-300 mb-6 line-clamp-3">
            Cuando un niño desaparece, un pequeño pueblo descubre un misterio que involucra experimentos secretos y fuerzas sobrenaturales.
          </p>
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-2 px-8 py-3 bg-white hover:bg-neutral-200 text-black font-semibold rounded-md transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Reproducir
            </button>
            <button (click)="goToDetail(66732)"
              class="flex items-center gap-2 px-8 py-3 bg-neutral-600/80 hover:bg-neutral-600 text-white font-semibold rounded-md transition-colors">
              Más información
            </button>
          </div>
        </div>
      </div>

      <!-- Carousels -->
      <div class="relative -mt-32 z-10 space-y-8 pb-16">

        <!-- Recomendadas -->
        <section class="px-4 md:px-8">
          <h2 class="text-xl font-semibold text-white mb-4">Recomendadas para ti</h2>
          <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
            @for (serie of recommended; track serie.id) {
              <div (click)="goToDetail(serie.tmdbId)"
                class="flex-shrink-0 w-40 md:w-48 group cursor-pointer">
                <div class="relative rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20">
                  <img [src]="serie.image" [alt]="serie.title" class="w-full aspect-[2/3] object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <h3 class="text-white text-sm font-medium truncate">{{ serie.title }}</h3>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Tendencias -->
        <section class="px-4 md:px-8">
          <h2 class="text-xl font-semibold text-white mb-4">Tendencias ahora</h2>
          <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
            @for (serie of trending; track serie.id) {
              <div (click)="goToDetail(serie.tmdbId)"
                class="flex-shrink-0 w-40 md:w-48 group cursor-pointer">
                <div class="relative rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20">
                  <img [src]="serie.image" [alt]="serie.title" class="w-full aspect-[2/3] object-cover">
                  <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <h3 class="text-white text-sm font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity">{{ serie.title }}</h3>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Top 10 -->
        <section class="px-4 md:px-8">
          <h2 class="text-xl font-semibold text-white mb-4">Top 10 en Guatemala hoy</h2>
          <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
            @for (serie of top10; track serie.id; let i = $index) {
              <div (click)="goToDetail(serie.tmdbId)"
                class="flex-shrink-0 w-40 md:w-48 group cursor-pointer relative">
                <span class="absolute -left-2 bottom-0 text-8xl font-bold text-neutral-800 z-10 select-none"
                  style="text-shadow: -2px 0 #404040, 2px 0 #404040;">
                  {{ i + 1 }}
                </span>
                <div class="relative rounded-lg overflow-hidden ml-6 transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20">
                  <img [src]="serie.image" [alt]="serie.title" class="w-full aspect-[2/3] object-cover">
                </div>
              </div>
            }
          </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class HomeScreenComponent {
  router = inject(Router);
  searchActive = signal(false);
  searchQuery = '';

  recommended: Serie[] = [
    { id: 1, tmdbId: 1396, title: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
    { id: 2, tmdbId: 66732, title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
    { id: 3, tmdbId: 71912, title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
    { id: 4, tmdbId: 71446, title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg' },
    { id: 5, tmdbId: 70523, title: 'Dark', image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
  ];

  trending: Serie[] = [
    { id: 1, tmdbId: 66732, title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
    { id: 2, tmdbId: 71912, title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
    { id: 3, tmdbId: 71446, title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg' },
    { id: 4, tmdbId: 70523, title: 'Dark', image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
    { id: 5, tmdbId: 63351, title: 'Narcos', image: 'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg' },
    { id: 6, tmdbId: 65494, title: 'The Crown', image: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg' },
    { id: 7, tmdbId: 79560, title: 'Ozark', image: 'https://image.tmdb.org/t/p/w500/pCGyPVrI9Fvw9VWkiOFHOHMlfnq.jpg' },
  ];

  top10: Serie[] = [
    { id: 1, tmdbId: 1396, title: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
    { id: 2, tmdbId: 66732, title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
    { id: 3, tmdbId: 71912, title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
    { id: 4, tmdbId: 71446, title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg' },
    { id: 5, tmdbId: 70523, title: 'Dark', image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
  ];

  toggleSearch() {
    this.searchActive.update(v => !v);
    if (!this.searchActive()) this.searchQuery = '';
  }

  goToDetail(tmdbId: number) {
    this.router.navigate(['/serie', tmdbId]);
  }
}