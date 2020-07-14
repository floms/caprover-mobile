import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { LoadAccounts } from './modules/shared/state/account.actions';
import { withLatestFrom, map } from 'rxjs/operators';
import { AccountState } from './modules/shared/state/account.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  @Select(AccountState.accounts) accounts$;

  constructor(private store: Store) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.store.dispatch(new LoadAccounts()).pipe(
      withLatestFrom(this.accounts$),
      map(([_, accounts]: any) => accounts.length > 0)
    );
  }

}
