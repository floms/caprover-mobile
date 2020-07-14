import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClusterPage } from './cluster.page';

const routes: Routes = [
  {
    path: '',
    component: ClusterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClusterPageRoutingModule {}
