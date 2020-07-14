import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxsModule } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

import { AppVersion } from '@ionic-native/app-version/ngx';

import { FormErrorComponent } from './components/form-error/form-error.component';
import { HtmlLogsPipe } from './html-logs.pipe';
import { ConsoleViewComponent } from './components/console-view/console-view.component';
import { EnvVarModalComponent } from './components/env-var-modal/env-var-modal.component';
import { DeploymentStepComponent } from './components/deployment-step/deployment-step.component';
import { MessageSuccessComponent } from './components/message-success/message-success.component';
import { TokenExpirationPipe } from './token-expiration.pipe';
import { AccountIconComponent } from './components/account-icon/account-icon.component';
import { AccountInfoBoxComponent } from './components/account-info-box/account-info-box.component';

@NgModule({
  declarations: [
    FormErrorComponent,
    ConsoleViewComponent,
    HtmlLogsPipe,
    EnvVarModalComponent,
    DeploymentStepComponent,
    MessageSuccessComponent,
    TokenExpirationPipe,
    AccountIconComponent,
    AccountInfoBoxComponent,
  ],
  entryComponents: [
    EnvVarModalComponent,
  ],
  imports: [
    IonicModule,
    FontAwesomeModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule
  ],
  exports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    FormErrorComponent,
    ConsoleViewComponent,
    HtmlLogsPipe,
    EnvVarModalComponent,
    DeploymentStepComponent,
    MessageSuccessComponent,
    TokenExpirationPipe,
    AccountIconComponent,
    AccountInfoBoxComponent,
  ],
  providers: [
    FingerprintAIO,
    AppVersion,
  ]
})
export class SharedModule {
  constructor(fa: FaIconLibrary) {
    fa.addIconPacks(fas, far, fab)
  }
}
