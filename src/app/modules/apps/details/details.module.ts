import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';

import { DetailsPage } from './details.page';
import { SharedModule } from '../../shared/shared.module';
import { ConfigComponent } from './config/config.component';
import { DeploymentComponent } from './deployment/deployment.component';
import { HttpComponent } from './http/http.component';
import { LogsComponent } from './logs/logs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [
    DetailsPage,
    ConfigComponent,
    DeploymentComponent,
    HttpComponent,
    LogsComponent
  ]
})
export class DetailsPageModule {}
