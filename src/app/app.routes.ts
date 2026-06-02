import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./screens/auth-screen/auth-screen.component')
        .then(m => m.AuthScreenComponent)
  },
  {
    path: 'onboarding/trailers',
    loadComponent: () =>
      import('./screens/onboarding-step1/onboarding-step1.component')
        .then(m => m.OnboardingStep1Component)
  },
  {
    path: 'onboarding/genres',
    loadComponent: () =>
      import('./screens/onboarding-step2/onboarding-step2.component')
        .then(m => m.OnboardingStep2Component)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./screens/home-screen/home-screen.component')
        .then(m => m.HomeScreenComponent)
  },
  {
    path: 'serie/:tmdbId',
    loadComponent: () =>
      import('./screens/serie-detail/serie-detail.component')
        .then(m => m.SerieDetailComponent)
  },
  { path: '**', redirectTo: '/auth' }
];