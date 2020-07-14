import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AppPageRoutingModule } from './apps-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccountState } from '../shared/state/account.state';

import { AppsPage } from './apps.page';
import { AppDeployComponent } from './app-deploy/app-deploy.component';
import { OneClickListComponent } from './one-click-list/one-click-list.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AppPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    AppsPage,
    OneClickListComponent,
    AppDeployComponent,
  ]
})
export class AppsPageModule {
  @Select(AccountState.active) account$: Observable<any>;
  constructor(router: Router) {
    this.account$.subscribe(account => {
      if (!account) {
        router.navigate(['/auth']);
      }
    })
  }
}
