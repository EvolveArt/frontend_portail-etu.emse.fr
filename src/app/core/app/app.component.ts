import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthenticatedUser } from '../models/auth.model';
import { NavItem, NavLink } from '../models/nav.model';
import { ALL_NAV_LINKS, NAV_LINKS } from '../data/nav.data';
import { AssociationLight } from '../models/association.model';
import { NavService } from '../services/nav.service';
import { AssociationService } from '../services/association.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSidenavService } from '../services/event-sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {
  logo = '../../../../assets/logo_bde.png';
  year = new Date().getFullYear();

  authPending = true;
  authenticatedUser: AuthenticatedUser;
  get authService() {
    return this._authService;
  }

  showSidenav = false;
  @ViewChild('sidenav') appDrawer: ElementRef;
  allNav: NavLink[];
  navItems: NavItem[] = [];

  showUsernav = false;

  showEventnav = false;

  assoLoaded = false;
  listsLoaded = false;

  constructor(
    private _authService: AuthService,
    private associationService: AssociationService,
    private navService: NavService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private eventSidenavService: EventSidenavService,
  ) {}

  ngOnInit() {
    this.initNavItems();
    this._authService.authenticatedUser.subscribe(authenticatedUser => {
      // console.log(authenticatedUser);
      this.authPending = false;
      this.authenticatedUser = authenticatedUser;
    });

    this.associationService.allAssos.subscribe((assos: AssociationLight[] | null) => {
      if (!this.assoLoaded) {
        const newNav = this.allNav.slice(0);
        for (let i = 0; i < assos.length; i++) {
          newNav.push({ label: assos[i].name, link: '/associations/' + assos[i].tag });
          this.navItems[0].children.push({
            displayName: assos[i].name,
            route: '/associations/' + assos[i].tag,
          });
        }
        this.allNav = newNav;
        this.assoLoaded = true;
      }
    });

    this.associationService.allLists.subscribe((assos: AssociationLight[] | null) => {
      if (!this.listsLoaded) {
        const newNav = this.allNav.slice(0);
        for (let i = 0; i < assos.length; i++) {
          newNav.push({ label: assos[i].name, link: '/associations/' + assos[i].tag });
          this.navItems[1].children.push({
            displayName: assos[i].name,
            route: '/associations/' + assos[i].tag,
          });
        }
        this.allNav = newNav;
        this.listsLoaded = true;
      }
    });

    this.eventSidenavService.isOpen.subscribe(isOpen => {
      this.showEventnav = isOpen;
    });
    this._authService.refresh();
    this.associationService.getLights();
  }

  initNavItems() {
    this.navItems.push({
      displayName: 'Associations',
      route: '',
      children: [],
    });
    this.navItems.push({
      displayName: 'Listes',
      route: '',
      children: [],
    });
    this.navItems.push({
      displayName: 'Autres Sites',
      route: '',
      children: [],
    });
    for (let i = 0; i < NAV_LINKS.length; i++) {
      this.navItems[2].children.push({
        displayName: NAV_LINKS[i].label,
        route: NAV_LINKS[i].link,
      });
    }
    this.allNav = ALL_NAV_LINKS;
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  navServiceCloseNav() {
    this.navService.closeNav();
  }

  navServiceOpenNav() {
    this.navService.openNav();
  }

  onLogoutClick() {
    this.closeSidenav();
    this._authService.logout();
    this.router.navigate([]);
  }

  onLoginClick() {
    this.authPending = true;
    AuthService.login();
  }

  closeSidenav() {
    this.showSidenav = false;
    this.showUsernav = false;
    this.showEventnav = false;
  }

  openSidenav() {
    this.closeSidenav();
    this.showSidenav = true;
  }

  openUsernav() {
    this.closeSidenav();
    this.showUsernav = true;
  }
}