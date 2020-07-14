import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Router, ActivatedRoute } from '@angular/router';

import { Login } from '../shared/state/account.actions';
import { tap } from 'rxjs/operators';
import { AccountState } from '../shared/state/account.state';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  viewPassword = false;
  loginForm: FormGroup;
  backRoute: string;

  @Select(AccountState.active) account$;
  @Select(AccountState.accounts) accounts$;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private ui: UIService,
    route: ActivatedRoute,
  ) {

    this.loginForm = this.fb.group({
      host: ['', Validators.required],
      password: ['', Validators.required],
      ssl: [true],
      remember: []
    });

    const accountHost = route.snapshot.paramMap.get('host');

    if (accountHost) {
      const authAccount = store.selectSnapshot(AccountState.account(accountHost));

      if (authAccount) {
        this.loginForm.patchValue({
          host: authAccount.host,
          ssl: authAccount.secure,
          remember: authAccount.remember
        });
      }
    }
  }

  async login() {
    const { host, ssl, password, remember } = this.loginForm.value;

    await this.ui.show(`Authenticating...`);

    this.store.dispatch(new Login(host, password, ssl, remember)).pipe(
      tap({
        error: (error) => {
          this.ui.dismiss();

          this.ui.alert({ title: 'Error', message: error.message });
        }
      }),
    ).subscribe(async () => {
      this.ui.dismiss();

      this.router.navigate(['/apps'], { replaceUrl: true });
    });
  }

  ngOnInit() {
    this.accounts$.subscribe((accounts) => {
      // have a default back route if there are other accounts
      if (accounts.length > 0) {
        this.backRoute = '/apps';
      }
    })
  }

  toggleViewPassword() {
    this.viewPassword = !this.viewPassword;
  }

}
