import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../core/models/event.model';

@Component({
  selector: 'app-event-description',
  template: `
    <mat-card-title>{{event.name}}</mat-card-title>

    <p>Organisé par {{event.association.name}}</p>

    <h4 *ngIf="event.closingDate">Attention deadline le {{ event.closingDate | date: 'EEEE d M' | translateDay}}
      à {{event.closingDate | date: 'H\\'h\\'mm'}}</h4>

    <p [innerHTML]="event.description | keepHtml"></p>

    <p>Le {{ event.date | date: 'EEEE d M' | translateDay}} à {{event.date | date: 'H\\'h\\'mm'}}</p>

    <p *ngIf="event.duration">
      Durée : {{event.duration}}
    </p>

    <p *ngIf="event.place">
      Lieu : {{event.place}}
    </p>

    <p *ngIf="event.price">
      Prix : {{event.price}} €
    </p>

    <ng-container *ngIf="event.price">
      <h5>Moyens de paiements possibles :</h5>
      <ul>
        <li *ngFor="let paymentMean of event.paymentMeans">{{paymentMean.name}}</li>
      </ul>
    </ng-container>

    <h4 *ngIf="event.shotgunListLength">Attention ! Événement au shotgun</h4>

    <p *ngIf="event.shotgunListLength">
      Début du shotgun le {{ event.shotgunStartingDate | date: 'EEEE d M' | translateDay}}
      à {{event.shotgunStartingDate | date: 'H\\'h\\'mm'}}
    </p>

    <p *ngIf="event.shotgunListLength">
      Nombre de places : {{event.shotgunListLength}}
    </p>

    <p *ngIf="event.shotgunListLength && event.shotgunWaitingList">Il y aura une file d'attente : les utilisateurs sont autorisés à
      continuer de s'incrire une fois le nombre maximal de places atteint</p>
    <p *ngIf="event.shotgunListLength && !event.shotgunWaitingList">Il y aura pas de file d'attente : Les utilisateurs NE sont PAS autorisés
      à continuer de s'incrire une fois le nombre maximal de places atteint</p>
    <p *ngIf="!event.closingDate">Pas de deadline</p>
  `,
  styles: [`
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      justify-content: center;
    }
  `]
})
export class EventDescriptionComponent implements OnInit {
  @Input() event: Event;
  constructor() { }

  ngOnInit() {
  }

}
