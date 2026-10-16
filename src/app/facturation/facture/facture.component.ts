import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpCardComponent } from '../../systeme-design/np-card/np-card.component';
import { NpTableComponent } from '../../systeme-design/np-table/np-table.component';
import {
  Depot,
  formaterMontant,
  soldeRestant,
  totalPaye,
} from '../../depot-linge/models/depot.model';
import { DepotStoreService } from '../../depot-linge/services/depot-store.service';
import { TarifService } from '../services/tarif.service';

@Component({
  selector: 'app-facture',
  imports: [RouterLink, NpButtonComponent, NpCardComponent, NpTableComponent],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.css',
})
export class FactureComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DepotStoreService);
  private readonly tarifs = inject(TarifService);
  depot: Depot | undefined;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.depot = this.store.getDepotById(id);
  }

  formater(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR');
  }

  montant(valeur: number): string {
    return formaterMontant(valeur);
  }

  ligne(type: string, service: string, quantite: number): string {
    return formaterMontant(this.tarifs.prix(type, service) * quantite);
  }

  total(d: Depot): string {
    return formaterMontant(d.montantTotal ?? 0);
  }

  paye(d: Depot): string {
    return formaterMontant(totalPaye(d));
  }

  solde(d: Depot): string {
    return formaterMontant(soldeRestant(d));
  }

  imprimer(): void {
    window.print();
  }
}
