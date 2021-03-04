import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './core/components/not-found-page.component';
import { AdminGuard } from './core/services/auth-guard.service';
import { HomeComponent } from './core/containers/home.component';
import { SponsorsComponent } from './core/components/sponsors/sponsors.component';
import { UserRechargeComponent } from './core/components/user-recharge/user-recharge.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canActivate: [AdminGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'associations',
    loadChildren: './associations/associations.module#AssociationsModule',
  },
  {
    path: 'sponsors',
    component: SponsorsComponent,
  },
  {
    path: 'events-settings',
    loadChildren: './events-settings/events-settings.module#EventsSettingsModule',
  },
  {
    path: 'bde-settings',
    loadChildren: './bde/bde.module#BdeModule',
  },
  {
    path: 'events',
    loadChildren: './events/events.module#EventsModule',
  },
  {
    path: 'recharge',
    component: UserRechargeComponent,
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', useHash: true})],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
