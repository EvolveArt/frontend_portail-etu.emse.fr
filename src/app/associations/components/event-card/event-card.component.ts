import {Component, Input, OnInit} from '@angular/core';
import {EventLight} from '../../../core/models/event.model';
import {UserService} from '../../../core/services/user.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  today = new Date();
  allReadyBooked = false;
  _event: EventLight;
  @Input()
  set event(event: EventLight) {
    this._event = event;
    this.allReadyBooked = this.userService.hasBooked(event.id);
  }
  get event() { return this._event; }

  @Input() isRightful: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(
      () => { this.allReadyBooked = this.userService.hasBooked(this.event.id); }
    );
  }

}
