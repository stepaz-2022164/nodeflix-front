import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { SeriesService } from '../../core/services/series.service';
import { InteractionService } from '../../core/services/interaction.service';

interface Trailer {
  id: number;
  title: string;
  image: string;
  selected: boolean;
  youtube_key?: string;
  safeUrl?: SafeResourceUrl;
}

@Component({
  selector: 'app-onboarding-step1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <div class="bg-black/90 border-b border-neutral-800">
        <div class="max-w-5xl mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-white">Paso 1: Elige tus trailers favoritos</h1>
          <p class="text-neutral-400 mt-2">Selecciona al menos 3 trailers que te interesen para personalizar tu experiencia</p>
          
          <div class="mt-4 flex items-center gap-4">
            <div class="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full transition-all duration-500" [style.width]="progressWidth()"></div>
            </div>
            <span class="text-sm text-neutral-400">{{ selectedCount() }}/3 mínimo</span>
          </div>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-8">
        
        @if (isLoading()) {
          <div class="flex justify-center items-center h-48">
             <span class="text-neutral-400">Cargando los mejores tráilers de TMDB...</span>
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (trailer of trailers(); track trailer.id) {
              <div
                (click)="toggleTrailer(trailer.id)"
                [class]="'relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ' +
                  (trailer.selected ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : 'ring-1 ring-neutral-700 hover:ring-neutral-600')"
              >
                <img
                  [src]="trailer.image"
                  [alt]="trailer.title"
                  class="w-full aspect-[2/3] object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="text-white text-sm font-medium truncate">{{ trailer.title }}</h3>
                </div>
                
                @if (trailer.selected) {
                  <div class="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                }

                <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    (click)="openModal(trailer, $event)"
                    class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg class="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <div class="mt-8 flex justify-end">
          <button
            (click)="continuar()"
            [disabled]="selectedCount() < 3 || isSaving()"
            [class]="'px-8 py-3 rounded-lg font-semibold transition-all ' +
              (selectedCount() >= 3 && !isSaving()
                ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105' 
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed')"
          >
            {{ isSaving() ? 'Guardando...' : 'Continuar' }}
          </button>
        </div>
      </div>

      @if (modalTrailer()) {
        <div 
          class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          (click)="closeModal()"
        >
          <div 
            class="bg-neutral-900 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl"
            (click)="$event.stopPropagation()"
          >
            <div class="aspect-video bg-neutral-800 flex items-center justify-center relative">
              
              @if (modalTrailer()?.safeUrl) {
                <iframe 
                  [src]="modalTrailer()?.safeUrl" 
                  class="absolute inset-0 w-full h-full"
                  frameborder="0" 
                  allow="autoplay; encrypted-media" 
                  allowfullscreen>
                </iframe>
              } @else {
                <div class="text-center">
                  <svg class="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-neutral-500">Tráiler no disponible para {{ modalTrailer()?.title }}</p>
                </div>
              }

            </div>
            <div class="p-4 flex items-center justify-between">
              <h3 class="text-white font-semibold text-lg">{{ modalTrailer()?.title }}</h3>
              <button
                (click)="closeModal()"
                class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})

export class OnboardingStep1Component implements OnInit {
  private router = inject(Router);
  private seriesService = inject(SeriesService);
  private interactionService = inject(InteractionService);
  private sanitizer = inject(DomSanitizer);

  trailers = signal<Trailer[]>([]);
  modalTrailer = signal<Trailer | null>(null);
  
  isLoading = signal(true);
  isSaving = signal(false);

  ngOnInit() {
    const randomPage = Math.floor(Math.random() * 4) + 1;

    this.seriesService.getPopulares(randomPage).subscribe({
      next: (res: any) => {
        if (res.success) {
          const seriesMezcladas = this.mezclarArreglo(res.data);
          const seleccionAleatoria = seriesMezcladas.slice(0, 12);
          
          const peticionesDetalles = seleccionAleatoria.map((s: any) => this.seriesService.getDetalleSerie(s.id_tmdb));
          
          forkJoin(peticionesDetalles).subscribe({
            next: (detallesRes: any) => {
              const trailersCompletos = detallesRes.map((d: any) => {
                const info = d.data;
                
                // 🌟 MAGIA AQUÍ: El Comodín Anti-Vacíos
                // Si TMDB nos manda un clip/teaser/trailer, lo usamos. 
                // Si TMDB nos manda NULL, usamos el ID 'aqz-KE-bpKQ' (Un corto animado open-source clásico)
                // Puedes cambiar esta llave por cualquier video de YouTube que quieras usar como "Fallo de señal" o "Animación Nodeflix"
                const finalKey = info.youtube_key || 'aqz-KE-bpKQ'; 
                
                return {
                  id: info.id_tmdb,
                  title: info.titulo,
                  image: info.poster ? `https://image.tmdb.org/t/p/w500${info.poster}` : 'placeholder.jpg',
                  selected: false,
                  youtube_key: finalKey,
                  safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
                    `https://www.youtube.com/embed/${finalKey}?autoplay=1&controls=1`
                  )
                };
              });
              
              this.trailers.set(trailersCompletos);
              this.isLoading.set(false);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error cargando los tráilers:', err);
        this.isLoading.set(false);
      }
    });
  }

  private mezclarArreglo(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  selectedCount = () => this.trailers().filter(t => t.selected).length;
  
  progressWidth = () => {
    const count = this.selectedCount();
    return Math.min((count / 3) * 100, 100) + '%';
  };

  toggleTrailer(id: number) {
    this.trailers.update(trailers => 
      trailers.map(t => t.id === id ? { ...t, selected: !t.selected } : t)
    );
  }

  openModal(trailer: Trailer, event: Event) {
    event.stopPropagation();
    this.modalTrailer.set(trailer);
  }

  closeModal() {
    this.modalTrailer.set(null);
  }

  continuar() {
    if (this.selectedCount() >= 3) {
      this.isSaving.set(true);

      const seleccionadas = this.trailers().filter(t => t.selected);
      
      const peticiones = seleccionadas.map(trailer => 
        this.interactionService.registrarInteraccion(trailer.id, 'LE_GUSTA')
      );

      forkJoin(peticiones).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/onboarding-2']);
        },
        error: (err) => {
          console.error('Error guardando los gustos:', err);
          this.isSaving.set(false);
          alert('Hubo un error al sincronizar con la base de datos.');
        }
      });
    }
  }
}