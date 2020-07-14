import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AccountState } from '../shared/state/account.state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SetActiveAccount, RemoveAccount } from '../shared/state/account.actions';
import { ModalController } from '@ionic/angular';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  @Select(AccountState.active) account$: Observable<any>;
  @Select(AccountState.otherAccounts) accounts$: Observable<any[]>;

  constructor(
    private router: Router,
    private store: Store,
    private modalController: ModalController,
    private ui: UIService,
  ) { }

  ngOnInit() { }

  addAccount() {
    this.navigate(['/auth', 'account']);
  }

  async logout(account: any) {
    await this.ui.show('Processing...');
    this.store.dispatch(new RemoveAccount(account)).subscribe(() => {
      this.ui.dismiss();

      this.modalController.dismiss();
    });
  }

  async setActiveAccount(account: any) {
    await this.ui.show('Processing...');

    this.store.dispatch(new SetActiveAccount(account)).subscribe(() => {
      this.ui.dismiss();

      this.navigate(['/apps'])
    })
  }

  private navigate(commands: string[]) {
    this.modalController.dismiss();

    return this.router.navigate(commands);
  }

}
