import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { PersonnelComponent } from './auth/personnel/personnel.component';
import { authGuard, gerantGuard } from './auth/guards/auth.guard';
import { TableauDeBordComponent } from './tableau-de-bord/tableau-de-bord.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TarifsComponent } from './facturation/tarifs/tarifs.component';
import { PageIntrouvableComponent } from './page-introuvable/page-introuvable.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'connexion', component: ConnexionComponent },
  {
    path: 'tableau-de-bord',
    component: TableauDeBordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tarifs',
    component: TarifsComponent,
    canActivate: [gerantGuard],
  },
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
  { path: '**', component: PageIntrouvableComponent },
];
