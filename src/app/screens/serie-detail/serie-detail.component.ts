import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface Serie {
  id: number;
  tmdbId: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-serie-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Hero -->
      <div class="relative h-[60vh] overflow-hidden">
        <img [src]="heroImage" alt="Hero" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <button (click)="router.navigate(['/home'])"
          class="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="relative -mt-48 z-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Poster -->
          <div class="flex-shrink-0 w-48 md:w-64">
            <img [src]="posterImage" alt="Poster"
              class="w-full rounded-xl shadow-2xl ring-1 ring-neutral-700">
          </div>

          <!-- Info -->
          <div class="flex-1">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">{{ serieName }}</h1>

            <!-- Meta -->
            <div class="flex items-center gap-4 mb-4 flex-wrap">
              <div class="flex items-center gap-1">
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-white font-semibold">9.5</span>
              </div>
              <span class="text-neutral-400">2008-2013</span>
              <span class="text-neutral-400">5 Temporadas</span>
              <span class="px-2 py-0.5 bg-neutral-700 text-neutral-300 text-xs rounded">TV-MA</span>
            </div>

            <!-- Genres -->
            <div class="flex gap-2 mb-6 flex-wrap">
              <span class="px-3 py-1 bg-red-600/20 text-red-500 text-sm rounded-full border border-red-600/30">Drama</span>
              <span class="px-3 py-1 bg-red-600/20 text-red-500 text-sm rounded-full border border-red-600/30">Crimen</span>
              <span class="px-3 py-1 bg-red-600/20 text-red-500 text-sm rounded-full border border-red-600/30">Thriller</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 mb-6 flex-wrap">
              <button class="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Reproducir
              </button>
              <button (click)="liked.set(!liked())"
                [class]="'flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ' +
                  (liked() ? 'bg-red-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700')">
                <svg class="w-5 h-5" [attr.fill]="liked() ? 'currentColor' : 'none'"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                {{ liked() ? 'Me gusta ✓' : 'Me gusta' }}
              </button>
              <button (click)="disliked.set(!disliked())"
                [class]="'flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ' +
                  (disliked() ? 'bg-neutral-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/>
                </svg>
                No me gusta
              </button>
              <button (click)="favorite.set(!favorite())"
                [class]="'flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ' +
                  (favorite() ? 'bg-yellow-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700')">
                <svg class="w-5 h-5" [attr.fill]="favorite() ? 'currentColor' : 'none'"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                {{ favorite() ? 'Favorita ★' : 'Favorita' }}
              </button>
            </div>

            <!-- Synopsis -->
            <div class="mb-6">
              <h3 class="text-white font-semibold mb-2">Sinopsis</h3>
              <p class="text-neutral-300 leading-relaxed">
                Un profesor de química se convierte en fabricante de metanfetamina tras un diagnóstico de cáncer terminal, transformando su vida en un thriller de crimen sin precedentes.
              </p>
            </div>
          </div>
        </div>

        <!-- Similar Series -->
        <section class="mt-12 pb-16">
          <h2 class="text-xl font-semibold text-white mb-4">Series similares</h2>
          <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
            @for (serie of similarSeries; track serie.id) {
              <div (click)="router.navigate(['/serie', serie.tmdbId])"
                class="flex-shrink-0 w-40 md:w-48 group cursor-pointer">
                <div class="relative rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20">
                  <img [src]="serie.image" [alt]="serie.title" class="w-full aspect-[2/3] object-cover">
                  <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 class="text-white text-sm font-medium truncate">{{ serie.title }}</h3>
                  </div>
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
export class SerieDetailComponent implements OnInit {
  router = inject(Router);
  private route = inject(ActivatedRoute);

  liked = signal(false);
  disliked = signal(false);
  favorite = signal(false);

  // En el futuro estos vendrán del backend según el tmdbId de la URL
  tmdbId = 1396;
  serieName = 'Breaking Bad';
  heroImage = 'https://image.tmdb.org/t/p/original/zzWGRw277MNoCs3zhyG3YmYQsXv.jpg';
  posterImage = 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg';

  similarSeries: Serie[] = [
    { id: 1, tmdbId: 60735, title: 'Better Call Saul', image: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg' },
    { id: 2, tmdbId: 79560, title: 'Ozark', image: 'https://image.tmdb.org/t/p/w500/pCGyPVrI9Fvw9VWkiOFHOHMlfnq.jpg' },
    { id: 3, tmdbId: 63351, title: 'Narcos', image: 'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg' },
    { id: 4, tmdbId: 1438, title: 'The Wire', image: 'https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg' },
    { id: 5, tmdbId: 60574, title: 'Peaky Blinders', image: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg' },
  ];

  ngOnInit() {
    this.tmdbId = Number(this.route.snapshot.paramMap.get('tmdbId'));
    // TODO: this.serieService.getDetalles(this.tmdbId).subscribe(...)
  }
}