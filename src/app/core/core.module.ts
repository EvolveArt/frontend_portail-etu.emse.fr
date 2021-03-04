import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { NotFoundPageComponent } from './components/not-found-page.component';

import { SharedModule } from '../shared/shared.module';
import { InfoComponent } from './components/info.component';
import { AuthService } from './services/auth.service';
import { InfoService } from './services/info.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { UrlSafeStringService } from './services/url-safe-string.service';
import { JsonLdService } from './services/json-ld.service';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { AdminGuard, AuthGuard } from './services/auth-guard.service';
import { HomeComponent } from './containers/home.component';
import { CustomSnackbarComponent } from './components/custom-snackbar.component';
import { CalendarContainerComponent } from './containers/calendar-container.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { EventSidenavComponent } from './components/event-sidenav.component';
import { UserSidenavComponent } from './components/user-sidenav.component';
import { SentryErrorHandler } from './services/sentry.service';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { SponsorComponent } from './components/sponsors/sponsor/sponsor.component';
import { UserRechargeComponent } from './components/user-recharge/user-recharge.component';

export const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent,
  InfoComponent,
  MenuListItemComponent,
  HomeComponent,
  CustomSnackbarComponent,
  CalendarContainerComponent,
  CalendarComponent,
  CalendarDayComponent,
  DatePickerComponent,
  EventSidenavComponent,
  UserSidenavComponent,
  SponsorsComponent,
  SponsorComponent,
  UserRechargeComponent
];

export const SERVICES = [
  AuthService,
  AuthGuard,
  AdminGuard,
  InfoService,
  UrlSafeStringService,
  JsonLdService,
  SentryErrorHandler,
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
  { provide: ErrorHandler, useClass: SentryErrorHandler },
];

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: [CustomSnackbarComponent],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }

  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: SERVICES,
    };
  }
}
