import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Genre {
  id: number;
  name: string;
  color: string;
  selected: boolean;
  series: { title: string; image: string }[];
}

@Component({
  selector: 'app-onboarding-step2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Header -->
      <div class="bg-black/90 border-b border-neutral-800 sticky top-0 z-30">
        <div class="max-w-5xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-white">Paso 2 de 2: Elige tus géneros favoritos</h1>
            <span class="text-red-500 font-bold text-lg">NODEFLIX</span>
          </div>
          <p class="text-neutral-400 text-sm">Selecciona los géneros que más te gustan</p>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full transition-all duration-500"
                [style.width]="progressWidth()"></div>
            </div>
            <span class="text-sm text-neutral-400 shrink-0">{{ selectedCount() }}/2 mínimo</span>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (genre of genres(); track genre.id) {
            <div (click)="toggleGenre(genre.id)"
              [class]="'relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ' +
                (genre.selected
                  ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20'
                  : 'ring-1 ring-neutral-700 hover:ring-neutral-600')">
              <div class="p-4 bg-neutral-900">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 rounded-full text-sm font-medium text-white"
                    [style.backgroundColor]="genre.color">
                    {{ genre.name }}
                  </span>
                  @if (genre.selected) {
                    <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  } @else {
                    <div class="w-6 h-6 border-2 border-neutral-600 rounded-full"></div>
                  }
                </div>
              </div>
              <div class="flex">
                @for (serie of genre.series; track serie.title) {
                  <div class="flex-1">
                    <img [src]="serie.image" [alt]="serie.title" class="w-full h-28 object-cover">
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="mt-8 flex justify-between items-center">
          <button (click)="router.navigate(['/onboarding/trailers'])"
            class="px-6 py-3 text-neutral-400 hover:text-white transition-colors">
            ← Volver
          </button>
          <button (click)="finalizar()"
            [disabled]="selectedCount() < 2"
            [class]="'px-8 py-3 rounded-lg font-semibold transition-all ' +
              (selectedCount() >= 2
                ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed')">
            Finalizar ✓
          </button>
        </div>
      </div>
    </div>
  `
})
export class OnboardingStep2Component {
  router = inject(Router);

  genres = signal<Genre[]>([
    { id: 1, name: 'Sci-Fi', color: '#8B5CF6', selected: false,
      series: [
        { title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w300/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
        { title: 'Dark', image: 'https://image.tmdb.org/t/p/w300/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
        { title: 'Black Mirror', image: 'https://image.tmdb.org/t/p/w300/7PRddO7z7mcPi21nMbDjczz3yXp.jpg' }
      ]
    },
    { id: 2, name: 'Drama', color: '#EF4444', selected: false,
      series: [
        { title: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
        { title: 'The Crown', image: 'https://image.tmdb.org/t/p/w300/1M876KPjulVwppEpldhdc8V4o68.jpg' },
        { title: 'Ozark', image: 'https://image.tmdb.org/t/p/w300/pCGyPVrI9Fvw9VWkiOFHOHMlfnq.jpg' }
      ]
    },
    { id: 3, name: 'Crimen', color: '#F59E0B', selected: false,
      series: [
        { title: 'Narcos', image: 'https://image.tmdb.org/t/p/w300/rTmal9fDbwh5F0waol2hq35U4ah.jpg' },
        { title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w300/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg' },
        { title: 'Mindhunter', image: 'https://image.tmdb.org/t/p/w300/8KPplKfpHfuLvGNXCuHSEOyq1kZ.jpg' }
      ]
    },
    { id: 4, name: 'Comedia', color: '#10B981', selected: false,
      series: [
        { title: 'The Office', image: 'https://image.tmdb.org/t/p/w300/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg' },
        { title: 'Brooklyn Nine-Nine', image: 'https://image.tmdb.org/t/p/w300/hgRMSOt7a1b8qyQR68vUixJPang.jpg' },
        { title: 'Friends', image: 'https://image.tmdb.org/t/p/w300/f496cm9enuEsZkSPzCwnTESEK5s.jpg' }
      ]
    },
    { id: 5, name: 'Fantasía', color: '#3B82F6', selected: false,
      series: [
        { title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w300/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
        { title: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/w300/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg' },
        { title: 'Shadow and Bone', image: 'https://image.tmdb.org/t/p/w300/srFiMz0hPnofMJifdCwskmAGbCR.jpg' }
      ]
    },
    { id: 6, name: 'Acción', color: '#EC4899', selected: false,
      series: [
        { title: 'The Mandalorian', image: 'https://image.tmdb.org/t/p/w300/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg' },
        { title: 'Jack Ryan', image: 'https://image.tmdb.org/t/p/w300/z6FFbmUgOLFwfp7K18GjH3sHQbG.jpg' },
        { title: 'Reacher', image: 'https://image.tmdb.org/t/p/w300/9pZBPkU9Ci3BcSQrJdJdmHD4YC9.jpg' }
      ]
    }
  ]);

  selectedCount = () => this.genres().filter(g => g.selected).length;
  progressWidth = () => Math.min((this.selectedCount() / 2) * 100, 100) + '%';

  toggleGenre(id: number) {
    this.genres.update(gs => gs.map(g => g.id === id ? { ...g, selected: !g.selected } : g));
  }

  finalizar() {
    if (this.selectedCount() >= 2) {
      // TODO: guardar en backend, marcar onboarding como completo
      this.router.navigate(['/home']);
    }
  }
}