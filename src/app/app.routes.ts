import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'depots',
    loadChildren: () =>
      import('./depot-linge/depot-linge.routes').then((m) => m.DEPOT_LINGE_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
