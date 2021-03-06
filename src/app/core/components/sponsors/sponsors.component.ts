import { Component } from '@angular/core';
import { SPONSORS_DATA } from '../../data/sponsors.data';
import { Sponsor } from '../../models/sponsor.model';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss'],
})
export class SponsorsComponent {
  sponsors: Sponsor[] = SPONSORS_DATA;
}
