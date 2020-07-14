import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP } from '@ionic-native/http/ngx';

import { SharedModule } from './modules/shared/shared.module';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule, Store, Select } from '@ngxs/store';
import { AppState } from './modules/shared/state/app.state';
import { environment } from '../environments/environment';
import { DeploymentState } from './modules/shared/state/deployment.state';
import { AccountState } from './modules/shared/state/account.state';
import { ResetAccounts } from './modules/shared/state/account.actions';
import { withLatestFrom } from 'rxjs/operators';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxsModule.forRoot([
      AccountState,
      AppState,
      DeploymentState,
    ], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    SharedModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  @Select(AccountState.accounts) accounts$;
  constructor(store: Store, router: Router) {
    store.dispatch(new ResetAccounts())
      .pipe(withLatestFrom(this.accounts$))
      .subscribe(([_, accounts]: any) => {
        if (accounts.length === 0) {
          router.navigate(['/auth']);
        }
      });
  }
}
