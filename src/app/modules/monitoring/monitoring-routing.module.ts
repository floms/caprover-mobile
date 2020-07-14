import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringPage } from './monitoring.page';

const routes: Routes = [
  {
    path: '',
    component: MonitoringPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitoringPageRoutingModule {}
