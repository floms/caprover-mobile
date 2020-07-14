import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsPage } from './apps.page';
import { AppDeployComponent } from './app-deploy/app-deploy.component';
import { OneClickListComponent } from './one-click-list/one-click-list.component';
import { OneClickAppResolver } from '../../services/one-click-app.resolver';
import { DeploymentGuard } from '../../services/deployment.guard';

const routes: Routes = [
  {
    path: 'home',
    component: AppsPage
  },
  {
    path: 'one-click',
    component: OneClickListComponent
  },
  {
    path: 'new',
    component: AppDeployComponent
  },

  {
    path: 'new/:name',
    component: AppDeployComponent,
    resolve: {
      app: OneClickAppResolver
    },
    canDeactivate: [
      DeploymentGuard
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppPageRoutingModule { }
