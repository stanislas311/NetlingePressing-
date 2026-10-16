import { Routes } from '@angular/router';
import { DepotListComponent } from './depot-list/depot-list.component';
import { DepotCreateComponent } from './depot-create/depot-create.component';
import { TicketComponent } from './ticket/ticket.component';

export const DEPOT_LINGE_ROUTES: Routes = [
  { path: '', component: DepotListComponent },
  { path: 'nouveau', component: DepotCreateComponent },
  { path: ':id/ticket', component: TicketComponent },
];
