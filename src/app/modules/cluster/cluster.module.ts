import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClusterPageRoutingModule } from './cluster-routing.module';

import { ClusterPage } from './cluster.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClusterPageRoutingModule
  ],
  declarations: [ClusterPage]
})
export class ClusterPageModule {}
