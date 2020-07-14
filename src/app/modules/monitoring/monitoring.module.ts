import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonitoringPageRoutingModule } from './monitoring-routing.module';

import { MonitoringPage } from './monitoring.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoringPageRoutingModule
  ],
  declarations: [MonitoringPage]
})
export class MonitoringPageModule {}
