import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SeriesService } from '../../core/services/series.service';
import { InteractionService } from '../../core/services/interaction.service';

interface Genre {
  id: number;
  name: string;
  color: string;
  selected: boolean;
  series: { id_tmdb: number; title: string; image: string }[];
}

@Component({
  selector: 'app-onboarding-step2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black">
      <div class="bg-black/90 border-b border-neutral-800 sticky top-0 z-30">
        <div class="max-w-5xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-white">Paso 2 de 2: Refina tus gustos</h1>
            <span class="text-red-500 font-bold text-lg">NODEFLIX</span>
          </div>
          <p class="text-neutral-400 text-sm">Basado en los tráilers que elegiste, descubrimos estos géneros para ti</p>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full transition-all duration-500"
                [style.width]="progressWidth()"></div>
            </div>
            <span class="text-sm text-neutral-400 shrink-0">{{ selectedCount() }}/2 mínimo</span>
          </div>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-8">
        
        @if (isLoading()) {
          <div class="flex flex-col justify-center items-center h-64 gap-4">
             <div class="w-12 h-12 border-4 border-neutral-700 border-t-red-600 rounded-full animate-spin"></div>
             <span class="text-neutral-400">Analizando tus tráilers favoritos con Neo4j...</span>
          </div>
        } @else {
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
                    <div class="flex-1 relative group">
                      <img [src]="serie.image" [alt]="serie.title" class="w-full h-32 object-cover">
                      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white text-center p-2 font-medium">
                        {{ serie.title }}
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }

        <div class="mt-8 flex justify-between items-center">
          <button (click)="router.navigate(['/onboarding-1'])"
            [disabled]="isSaving()"
            class="px-6 py-3 text-neutral-400 hover:text-white transition-colors disabled:opacity-50">
            ← Volver
          </button>
          <button (click)="finalizar()"
            [disabled]="selectedCount() < 2 || isSaving() || isLoading()"
            [class]="'px-8 py-3 rounded-lg font-semibold transition-all ' +
              (selectedCount() >= 2 && !isSaving()
                ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 shadow-lg shadow-red-600/30'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed')">
            {{ isSaving() ? 'Configurando tu inicio...' : 'Finalizar ✓' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class OnboardingStep2Component implements OnInit {
  router = inject(Router);
  private seriesService = inject(SeriesService);
  private interactionService = inject(InteractionService);

  genres = signal<Genre[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);

  ngOnInit() {
    // 1. Pedimos las RECOMENDACIONES basadas en los tráilers del Paso 1
    this.seriesService.getRecomendaciones().subscribe({
      next: (res: any) => {
        if (res.success && res.data.length > 0) {
          // Tomamos el top 12 de series recomendadas para extraer sus géneros
          const topRecomendadas = res.data.slice(0, 12);
          
          const peticionesDetalles = topRecomendadas.map((s: any) => this.seriesService.getDetalleSerie(s.id_tmdb));
          
          forkJoin(peticionesDetalles).subscribe({
            next: (detallesRes: any) => {
              const mapaGeneros = new Map<number, Genre>();
              // Paleta de colores para que las etiquetas se vean increíbles
              const colores = ['#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#14B8A6', '#F43F5E'];
              let colorIndex = 0;

              // 2. Agrupamos las series recomendadas por género
              detallesRes.forEach((d: any) => {
                const info = d.data;
                if (info.generos) {
                  info.generos.forEach((gen: any) => {
                    if (!mapaGeneros.has(gen.id)) {
                      mapaGeneros.set(gen.id, {
                        id: gen.id,
                        name: gen.name,
                        color: colores[colorIndex % colores.length],
                        selected: false,
                        series: []
                      });
                      colorIndex++;
                    }

                    const genreGroup = mapaGeneros.get(gen.id)!;
                    // Llenamos la tarjeta del género (máximo 3 series por tarjeta para el diseño)
                    if (genreGroup.series.length < 3 && !genreGroup.series.find(s => s.id_tmdb === info.id_tmdb)) {
                      genreGroup.series.push({
                        id_tmdb: info.id_tmdb,
                        title: info.titulo,
                        image: info.poster ? `https://image.tmdb.org/t/p/w300${info.poster}` : 'placeholder.jpg'
                      });
                    }
                  });
                }
              });

              // 3. Filtramos para mostrar solo tarjetas que tengan al menos 2 imágenes y mostramos un máximo de 8 tarjetas
              const generosFinales = Array.from(mapaGeneros.values())
                                          .filter(g => g.series.length >= 2)
                                          .slice(0, 8);
              
              this.genres.set(generosFinales);
              this.isLoading.set(false);
            }
          });
        } else {
           // Fallback en caso de error
           this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error cargando recomendaciones para géneros:', err);
        this.isLoading.set(false);
      }
    });
  }

  selectedCount = () => this.genres().filter(g => g.selected).length;
  progressWidth = () => Math.min((this.selectedCount() / 2) * 100, 100) + '%';

  toggleGenre(id: number) {
    this.genres.update(gs => gs.map(g => g.id === id ? { ...g, selected: !g.selected } : g));
  }

  finalizar() {
    if (this.selectedCount() >= 2) {
      this.isSaving.set(true);

      const generosSeleccionados = this.genres().filter(g => g.selected);
      let seriesAImportar: number[] = [];
      
      // Extraemos los IDs de las series que pertenecen a los géneros que seleccionaste
      generosSeleccionados.forEach(genero => {
        genero.series.forEach(serie => seriesAImportar.push(serie.id_tmdb));
      });

      const peticiones = seriesAImportar.map(idTmdb => 
        this.interactionService.registrarInteraccion(idTmdb, 'LE_GUSTA')
      );

      forkJoin(peticiones).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/inicio']); 
        },
        error: (err) => {
          console.error('Error al guardar géneros:', err);
          this.isSaving.set(false);
          this.router.navigate(['/inicio']); 
        }
      });
    }
  }
}