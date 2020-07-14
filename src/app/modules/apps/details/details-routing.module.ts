import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPage } from './details.page';
import { HttpComponent } from './http/http.component';
import { ConfigComponent } from './config/config.component';
import { DeploymentComponent } from './deployment/deployment.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsPage,
    children: [
      {
        path: 'http',
        component: HttpComponent,
      },
      {
        path: 'config',
        component: ConfigComponent,
      },
      {
        path: 'deployment',
        component: DeploymentComponent,
      },
      {
        path: 'logs',
        component: LogsComponent,
      },
      {
        path: '',
        redirectTo: 'http',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPageRoutingModule {}
