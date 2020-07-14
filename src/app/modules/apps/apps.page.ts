import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { AppState } from '../shared/state/app.state';
import { AccountState } from '../shared/state/account.state';
import { LoadApps, SetActiveApp } from '../shared/state/app.actions';
import { AccountPage } from '../account/account.page';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.page.html',
  styleUrls: ['./apps.page.scss'],
})
export class AppsPage implements OnInit {
  @Select(AppState.definition) definition$: Observable<any>;
  @Select(AccountState.active) account$: Observable<any>;

  results$: Observable<any>;
  search$ = new BehaviorSubject<string>(null);

  constructor(
    private store: Store,
    private router: Router,
    private modalController: ModalController,
  ) { }

  onSearch(event: any) {
    const text = event.target.value.toUpperCase().trim();

    this.search$.next(text);
  }

  doRefresh(event) {
    this.store.dispatch(new LoadApps()).subscribe(() => {
      event.target.complete();
    });
  }

  ngOnInit() {
    this.store.dispatch(new LoadApps());

    this.results$ = combineLatest(this.definition$, this.search$).pipe(
      map(([defs, keyword]) => {
        let appDefinitions = defs.appDefinitions;

        if (keyword) {
          appDefinitions = appDefinitions.filter(({ appName, description }) => {
            return appName.toUpperCase().indexOf(keyword) >= 0 || description.toUpperCase().indexOf(keyword) >= 0;
          });

        }

        return {
          ...defs,
          appDefinitions
        };
      })
    );
  }

  viewApp(app: any) {
    this.store.dispatch(new SetActiveApp(app.appName));

    return this.router.navigate(['apps', app.appName]);
  }

  async changeAccount() {
    const modal = await this.modalController.create({
      component: AccountPage,
      cssClass: 'account-modal-page'
    });

    return await modal.present();
  }

  deploy(oneClick = false) {
    return this.router.navigate(['apps', oneClick ? 'one-click' : 'new']);
  }

  navigate(info: any, app: any) {
    const scheme = app.hasDefaultSubDomainSsl ? 'https' : 'http';

    window.open(`${scheme}://${app.appName}.${info.rootDomain}`, '_system', 'location=yes');
  }
}