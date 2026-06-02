import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Trailer {
  id: number;
  title: string;
  image: string;
  selected: boolean;
}

@Component({
  selector: 'app-onboarding-step1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Header -->
      <div class="bg-black/90 border-b border-neutral-800 sticky top-0 z-30">
        <div class="max-w-5xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-white">Paso 1 de 2: Elige tus trailers favoritos</h1>
            <span class="text-red-500 font-bold text-lg">NODEFLIX</span>
          </div>
          <p class="text-neutral-400 text-sm">Selecciona al menos 3 trailers que te interesen</p>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full transition-all duration-500"
                [style.width]="progressWidth()"></div>
            </div>
            <span class="text-sm text-neutral-400 shrink-0">{{ selectedCount() }}/3 mínimo</span>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (trailer of trailers(); track trailer.id) {
            <div (click)="toggleTrailer(trailer.id)"
              [class]="'relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ' +
                (trailer.selected
                  ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20'
                  : 'ring-1 ring-neutral-700 hover:ring-neutral-600')">
              <img [src]="trailer.image" [alt]="trailer.title" class="w-full aspect-[2/3] object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <h3 class="text-white text-sm font-medium truncate">{{ trailer.title }}</h3>
              </div>
              @if (trailer.selected) {
                <div class="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="mt-8 flex justify-end">
          <button (click)="continuar()"
            [disabled]="selectedCount() < 3"
            [class]="'px-8 py-3 rounded-lg font-semibold transition-all ' +
              (selectedCount() >= 3
                ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed')">
            Continuar →
          </button>
        </div>
      </div>
    </div>
  `
})
export class OnboardingStep1Component {
  private router = inject(Router);

  trailers = signal<Trailer[]>([
    { id: 1, title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', selected: false },
    { id: 2, title: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', selected: false },
    { id: 3, title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', selected: false },
    { id: 4, title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', selected: false },
    { id: 5, title: 'Dark', image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', selected: false },
    { id: 6, title: 'Narcos', image: 'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg', selected: false },
    { id: 7, title: 'The Crown', image: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg', selected: false },
    { id: 8, title: 'Ozark', image: 'https://image.tmdb.org/t/p/w500/pCGyPVrI9Fvw9VWkiOFHOHMlfnq.jpg', selected: false },
    { id: 9, title: 'Black Mirror', image: 'https://image.tmdb.org/t/p/w500/7PRddO7z7mcPi21nMbDjczz3yXp.jpg', selected: false },
    { id: 10, title: 'Mindhunter', image: 'https://image.tmdb.org/t/p/w500/8KPplKfpHfuLvGNXCuHSEOyq1kZ.jpg', selected: false },
    { id: 11, title: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', selected: false },
    { id: 12, title: 'The Office', image: 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg', selected: false },
  ]);

  selectedCount = () => this.trailers().filter(t => t.selected).length;
  progressWidth = () => Math.min((this.selectedCount() / 3) * 100, 100) + '%';

  toggleTrailer(id: number) {
    this.trailers.update(ts => ts.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  }

  continuar() {
    if (this.selectedCount() >= 3) {
      // TODO: guardar selecciones en OnboardingService
      this.router.navigate(['/onboarding/genres']);
    }
  }
}