import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { GuestGuard } from '../../guest.guard';
import { AuthGuard } from '../../auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [GuestGuard],
    component: AuthPage
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    component: AuthPage
  },
  {
    path: 'verify/:host',
    component: AuthPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule { }
