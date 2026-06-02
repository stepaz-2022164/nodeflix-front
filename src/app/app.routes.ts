import { Routes } from '@angular/router';
import { AuthScreenComponent } from './screens/auth-screen/auth-screen.component';
import { OnboardingStep1Component } from './screens/onboarding-step1/onboarding-step1.component';
import { OnboardingStep2Component } from './screens/onboarding-step2/onboarding-step2.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { SerieDetailComponent } from './screens/serie-detail/serie-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthScreenComponent },
  { path: 'onboarding-1', component: OnboardingStep1Component },
  { path: 'onboarding-2', component: OnboardingStep2Component },
  { path: 'inicio', component: HomeScreenComponent },
  { path: 'serie/:id', component: SerieDetailComponent },
  { path: '**', redirectTo: 'login' }
];