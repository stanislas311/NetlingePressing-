import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DepotStoreService } from '../depot-linge/services/depot-store.service';
import { NotificationApp, NotificationService } from './services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  private readonly notifications = inject(NotificationService);
  private readonly store = inject(DepotStoreService);
  liste: NotificationApp[] = [];

  constructor() {
    this.notifications.synchroniserRetards(this.store.listerDepots());
    this.liste = this.notifications.lister();
  }

  formater(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR');
  }
}
