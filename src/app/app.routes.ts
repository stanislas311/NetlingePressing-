import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { PersonnelComponent } from './auth/personnel/personnel.component';
import { authGuard, gerantGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'connexion', component: ConnexionComponent },
  {
    path: 'personnel',
    component: PersonnelComponent,
    canActivate: [gerantGuard],
  },
  {
    path: 'depots',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./depot-linge/depot-linge.routes').then((m) => m.DEPOT_LINGE_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
