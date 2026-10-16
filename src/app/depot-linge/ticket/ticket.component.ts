import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Depot, STATUT_LABELS, DepotStatut } from '../models/depot.model';
import { DepotStoreService } from '../services/depot-store.service';

const formateurDate = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

@Component({
  selector: 'app-ticket',
  imports: [RouterLink],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DepotStoreService);

  depot: Depot | undefined;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.depot = this.store.getDepotById(id);
  }

  formaterDate(iso: string): string {
    return formateurDate.format(new Date(iso));
  }

  libelleStatut(statut: DepotStatut): string {
    return STATUT_LABELS[statut];
  }

  imprimer(): void {
    window.print();
  }
}
