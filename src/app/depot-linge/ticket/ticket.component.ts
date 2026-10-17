import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpCardComponent } from '../../systeme-design/np-card/np-card.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { NpStatusBadgeComponent } from '../../systeme-design/np-status-badge/np-status-badge.component';
import { NpTableComponent } from '../../systeme-design/np-table/np-table.component';
import {
  dateRetraitEnIso,
  Depot,
  depotVerrouille,
  DepotStatut,
  formaterMontant,
  jourLocal,
  soldeRestant,
  STATUT_LABELS,
  telephoneWhatsApp,
  totalPaye,
} from '../models/depot.model';
import { DepotStoreService } from '../services/depot-store.service';
import { TarifService } from '../../facturation/services/tarif.service';

const formateurDate = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

@Component({
  selector: 'app-ticket',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NpButtonComponent,
    NpCardComponent,
    NpFormFieldComponent,
    NpStatusBadgeComponent,
    NpTableComponent,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DepotStoreService);
  private readonly tarifs = inject(TarifService);

  depot: Depot | undefined;
  readonly dateEdition = new FormControl('', { nonNullable: true });
  readonly montantPaiement = new FormControl(0, { nonNullable: true });
  readonly motifAnnulation = new FormControl('', { nonNullable: true });
  readonly etapesCircuit: { cle: DepotStatut; libelle: string }[] = [
    { cle: 'depose', libelle: 'Déposé' },
    { cle: 'en-lavage', libelle: 'En lavage' },
    { cle: 'pret', libelle: 'Prêt' },
    { cle: 'livre', libelle: 'Livré' },
  ];
  editionOuverte = false;
  panneauPaiementOuvert = false;
  panneauAnnulationOuvert = false;
  erreurEdition: string | null = null;
  erreurAction: string | null = null;
  messageAction: string | null = null;

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

  montant(valeur: number): string {
    return formaterMontant(valeur);
  }

  prixLigne(type: string, service: string, quantite: number): string {
    return formaterMontant(this.tarifs.prix(type, service) * quantite);
  }

  total(): string {
    return formaterMontant(this.depot?.montantTotal ?? 0);
  }

  paye(): string {
    return this.depot ? formaterMontant(totalPaye(this.depot)) : formaterMontant(0);
  }

  solde(): string {
    return this.depot ? formaterMontant(soldeRestant(this.depot)) : formaterMontant(0);
  }

  soldeNumerique(): number {
    return this.depot ? soldeRestant(this.depot) : 0;
  }

  estSolde(): boolean {
    return this.soldeNumerique() === 0;
  }

  peutAvancer(): boolean {
    return !!this.depot && !depotVerrouille(this.depot.statut);
  }

  indexStatutCourant(): number {
    if (!this.depot) return -1;
    return this.etapesCircuit.findIndex((e) => e.cle === this.depot!.statut);
  }

  libelleProchaineEtape(): string {
    if (!this.depot) return '';
    const index = this.indexStatutCourant();
    if (index >= 0 && index < this.etapesCircuit.length - 1) {
      return this.etapesCircuit[index + 1].libelle;
    }
    return '';
  }

  togglePaiement(): void {
    this.panneauPaiementOuvert = !this.panneauPaiementOuvert;
    if (this.panneauPaiementOuvert) {
      this.panneauAnnulationOuvert = false;
      this.editionOuverte = false;
      this.solderTout();
    }
  }

  toggleAnnulation(): void {
    this.panneauAnnulationOuvert = !this.panneauAnnulationOuvert;
    if (this.panneauAnnulationOuvert) {
      this.panneauPaiementOuvert = false;
      this.editionOuverte = false;
    }
  }

  lienWhatsApp(): string | null {
    if (!this.depot || this.depot.statut !== 'pret') {
      return null;
    }
    const numero = telephoneWhatsApp(this.depot.clientTelephone);
    const texte = encodeURIComponent(
      `Bonjour ${this.depot.clientNom}, votre linge (ticket ${this.depot.ticketNumero}) est pret a Netlinge Pressing. Vous pouvez venir le retirer.`
    );
    return `https://wa.me/${numero}?text=${texte}`;
  }

  passerAuStatutSuivant(): void {
    if (!this.depot) {
      return;
    }
    this.erreurAction = null;
    const resultat = this.store.passerAuStatutSuivant(this.depot.id);
    this.depot = this.store.getDepotById(this.depot.id);
    if (!resultat) {
      this.erreurAction =
        'Impossible d’avancer : le solde doit être intégralement payé avant la livraison.';
    } else {
      this.messageAction = `Le statut a été mis à jour vers : ${STATUT_LABELS[resultat.statut]}.`;
    }
  }

  solderTout(): void {
    if (!this.depot) {
      return;
    }
    this.montantPaiement.setValue(soldeRestant(this.depot));
  }

  solderEtLivrer(): void {
    if (!this.depot) {
      return;
    }
    const restant = soldeRestant(this.depot);
    if (restant > 0) {
      this.store.enregistrerPaiement(this.depot.id, restant);
    }
    const livre = this.store.passerAuStatutSuivant(this.depot.id);
    this.depot = this.store.getDepotById(this.depot.id);
    if (livre) {
      this.erreurAction = null;
      this.messageAction = 'Dépôt intégralement soldé et marqué comme Livré !';
    }
  }

  encaisser(): void {
    if (!this.depot) {
      return;
    }
    this.erreurAction = null;
    const montant = Number(this.montantPaiement.value);
    const resultat = this.store.enregistrerPaiement(this.depot.id, montant);
    if (!resultat) {
      this.erreurAction = 'Paiement refusé. Saisissez un montant positif inférieur ou égal au solde.';
      return;
    }
    this.depot = resultat;
    this.montantPaiement.setValue(0);
    this.panneauPaiementOuvert = false;
    this.messageAction = 'Paiement enregistré avec succès.';
  }

  confirmerAnnulation(): void {
    if (!this.depot) {
      return;
    }
    this.erreurAction = null;
    const resultat = this.store.annulerDepot(this.depot.id, this.motifAnnulation.value);
    if (!resultat) {
      this.erreurAction = 'L’annulation exige un motif et n’est possible que si le dépôt n’est ni livré ni déjà annulé.';
      return;
    }
    this.depot = resultat;
    this.panneauAnnulationOuvert = false;
  }

  imprimer(): void {
    window.print();
  }

  ouvrirEdition(): void {
    if (!this.depot) {
      return;
    }
    this.dateEdition.setValue(jourLocal(new Date(this.depot.dateRetraitPrevue)));
    this.editionOuverte = true;
    this.panneauPaiementOuvert = false;
    this.panneauAnnulationOuvert = false;
    this.erreurEdition = null;
  }

  annulerEdition(): void {
    this.editionOuverte = false;
    this.erreurEdition = null;
  }

  enregistrerDateRetrait(): void {
    if (!this.depot) {
      return;
    }
    const saisie = this.dateEdition.value;
    if (!saisie) {
      this.erreurEdition = 'La date de retrait est obligatoire.';
      return;
    }
    const nouvelleDateIso = dateRetraitEnIso(saisie, this.depot.dateDepot);
    const resultat = nouvelleDateIso
      ? this.store.modifierDateRetrait(this.depot.id, nouvelleDateIso)
      : null;
    if (!resultat) {
      this.erreurEdition =
        'La date de retrait ne peut pas être antérieure à la date de dépôt.';
      return;
    }
    this.depot = this.store.getDepotById(this.depot.id);
    this.editionOuverte = false;
    this.erreurEdition = null;
    this.messageAction = 'Date de retrait mise à jour.';
  }
}
