import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins, StatusBarStyle } from '@capacitor/core';

import { Platform, ModalController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Observable, of, from } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { Select } from '@ngxs/store';

import { AccountState } from './modules/shared/state/account.state';
import { AccountPage } from './modules/account/account.page';

const { StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(AccountState.active) account$: Observable<any>;
  version$: Observable<string>;

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Apps',
      url: '/apps',
      icon: 'cubes'
    },
    // TODO: to be implemented
    // {
    //   title: 'Monitoring',
    //   url: '/monitoring',
    //   icon: 'file-medical-alt'
    // },
    // {
    //   title: 'Cluster',
    //   url: '/cluster',
    //   icon: 'network-wired'
    // },
    // {
    //   title: 'Settings',
    //   url: '/settings',
    //   icon: 'cog'
    // },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private menuController: MenuController,
    private router: Router,
    private modalController: ModalController,
    private appVersion: AppVersion,

  ) {
    this.initializeApp();

    this.version$ = from(this.appVersion.getVersionNumber()).pipe(startWith('0.1'))
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setStyle({
        style: StatusBarStyle.Light
      });

      if (this.platform.is('android')) {
        StatusBar.setBackgroundColor({ color: '#ffffff' });
      }

      StatusBar.show();

      this.splashScreen.hide();
    });
  }

  async changeAccount() {
    this.menuController.close();

    const modal = await this.modalController.create({
      component: AccountPage,
      cssClass: 'account-modal-page'
    });

    return await modal.present();
  }

  ngOnInit() {
    const path = window.location.pathname;

    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => path.toLowerCase().indexOf(page.url.toLowerCase()) > -1);
    }

  }
}
