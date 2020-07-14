import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountState } from './modules/shared/state/account.state';
import { Select, Store } from '@ngxs/store';
import { withLatestFrom, map, tap } from 'rxjs/operators';
import { LoadAccounts } from './modules/shared/state/account.actions';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  @Select(AccountState.accounts) accounts$;

  constructor(private store: Store, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.store.dispatch(new LoadAccounts()).pipe(
      withLatestFrom(this.accounts$),
      map(([_, accounts]: any) => accounts.length === 0),
      tap(isGuest => {
        if (!isGuest) {
          this.router.navigate(['apps']);
        }
      })
    );
  }

}
