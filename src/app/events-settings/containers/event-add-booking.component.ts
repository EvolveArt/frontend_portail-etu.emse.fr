import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Event, EventBooking, NewBooking} from '../../core/models/event.model';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {Observable} from 'rxjs';
import {UserLight} from '../../core/models/auth.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../core/services/user.service';
import {map, startWith} from 'rxjs/operators';
import {arrayFindById} from '../../core/services/utils';
import {EventService} from '../../core/services/event.service';
import {InfoService} from '../../core/services/info.service';

@Component({
  selector: 'app-event-add-booking',
  template: `
    <p>Élève de l'école :</p>
    <form [formGroup]="form">
      <div class="row">
        <mat-form-field class="col-10">
          <input type="text"
                 placeholder="Prénom et Nom"
                 matInput [matAutocomplete]="auto"
                 [formControl]="userText">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let option of filteredOptions | async"
                        [value]="option.id ? option.firstname + ' ' + option.lastname : option.username"
                        (click)="select(option)">
              <span *ngIf="option.id">{{option.firstname}} {{option.lastname}} promo {{option.promo}}</span>
              <span *ngIf="!option.id">{{option.username}}</span>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <div class="col-2 d-flex flex-column justify-content-center">
          <mat-icon color="warn" (click)="clear()">clear</mat-icon>
        </div>
      </div>
    </form>
    <p *ngIf="!newBookingUser">Sinon (pas de compte EMSE) :</p>
    <p *ngIf="newBookingUser && !alreadyBooked">
      Réserver au nom de {{newBookingUser.firstname}} {{newBookingUser.lastname}} promo {{newBookingUser.promo}}
    </p>
    <app-booking-form [authenticatedUser]="newBookingUser"
                      [relatedEvent]="event"
                      [BDEBalance]="newBookingUser ? newBookingUser.balance : null"
                      [isFromSetting]="true"
                      [isNew]="true" (submitted)="book($event)" *ngIf="!alreadyBooked && !pending">
    </app-booking-form>
    <p *ngIf="alreadyBooked">{{newBookingUser.firstname}} {{newBookingUser.lastname}} promo {{newBookingUser.promo}} a déjà réservé</p>
    <div class="centrer" *ngIf="pending">
      <mat-spinner  [diameter]="150" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [`
    mat-icon {
      transform: scale(2);
      cursor: pointer;
    }
  `]
})
export class EventAddBookingComponent implements OnInit {
  @Input() event: Event;
  @Input()
  set selectedUser(selectedUser) {
    if (selectedUser) {
      this.select(selectedUser);
      this.userText.setValue(selectedUser.firstname + ' ' + selectedUser.lastname);
    }
  }
  @Input() isAdmin: boolean;
  @Input() paymentMeans: PaymentMeans[];
  @Output() addBooking = new EventEmitter<EventBooking>();
  filteredOptions: Observable<UserLight>;
  users;
  alreadyBooked = false;
  newBookingUser: UserLight = null;

  pending = false;

  form: FormGroup = this.fb.group({
    userText: [''],
  });

  get userText() { return this.form.get('userText'); }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private eventService: EventService,
    private infoService: InfoService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users: UserLight[]) => {
      this.users = users;
    });
    this.filteredOptions = this.userText.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  _filter(value: string) {
    const filterValue = value.toLowerCase();
    if (this.users) {
      return this.users.filter(
        (user) => {
          if (user.id) {
            return (user.firstname + ' ' + user.lastname).toLowerCase().includes(filterValue);
          } else {
            return user.username.toLowerCase().includes(filterValue);
          }
        }
      );
    } else {
      return [];
    }
  }

  select(user) {
    let found = false;
    for (let i = 0; i < this.event.bookings.length; i++) {
      if (this.event.bookings[i].user && this.event.bookings[i].user.id === user.id) {
        this.alreadyBooked = true;
        found = true;
      }
    }
    this.newBookingUser = user;
  }

  clear() {
    this.userText.setValue('');
    this.newBookingUser = null;
    this.alreadyBooked = false;
  }

  book(newBooking: NewBooking) {
    this.pending = true;
    // console.log(newBooking);
    // setTimeout(() => {this.pending = false; }, 2000);
    this.eventService.book(newBooking).subscribe(
      (booking) => {
        // console.log(booking);
        this.addBooking.emit(booking);
        this.pending = false;
        this.infoService.pushSuccess('Réservation effectuée');
        this.clear();
      },
      (error) => {
        this.pending = false;
      }
    );
  }

}
