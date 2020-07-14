import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store, createSelector } from '@ngxs/store';
import { Plugins } from '@capacitor/core';

import { LoadAccounts, AddAccount, SetActiveAccount, ClearActiveAccount, RemoveAccount, LoadAccountsSuccess, Login, ResetAccounts, AuthenticateCurrentAccount, AuthenticateAccount } from './account.actions';
import { AccountStateModel, AccountI } from './account.i';
import { ApiService } from '../../../services/api.service';
import { from, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { HttpService } from '../../../services/http.service';
import { LoadApps } from './app.actions';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

const { Storage } = Plugins;

type Context = StateContext<AccountStateModel>;

@State<AccountStateModel>({
    name: 'account',
    defaults: {
        accounts: [],
        active: null,
    }
})
@Injectable()
export class AccountState {
    private readonly BIOMETRICS_ENABLED = false;

    static account(host: string) {
        return createSelector([AccountState], (state: AccountStateModel) => {
            return state.accounts.find(account => account.host === host);
        });
    }

    @Selector()
    static accounts(state: AccountStateModel) {
        return state.accounts;
    }

    @Selector()
    static active(state: AccountStateModel) {
        return state.accounts.find((account) => {
            if (!state.active) {
                return account;
            }

            return account.host === state.active;
        });
    }

    @Selector()
    static otherAccounts(state: AccountStateModel) {
        if (state.accounts.length === 1) {
            return [];
        } else if (!state.active) {
            return state.accounts.slice(1);
        }

        return state.accounts.filter((account) => account.host !== state.active);
    }

    constructor(
        private store: Store,
        private api: ApiService,
        private http: HttpService,
        private router: Router,
        private auth: AuthService,
    ) { }

    @Action(Login)
    login(ctx: Context, action: Login) {
        const accountInfo = {
            host: action.host,
            secure: action.secure,
            remember: action.remember,
            token: undefined
        };

        return ctx.dispatch(new AddAccount(accountInfo)).pipe(
            switchMap(() => from(this.api.login(action.password))),
            tap({
                error() {
                    ctx.dispatch(new RemoveAccount(accountInfo))
                }
            }),
            switchMap((response) => {
                return ctx.dispatch(new AddAccount({
                    ...accountInfo, token: response.data.token
                }));
            }),
        );
    }

    @Action(ResetAccounts)
    resetAccounts(ctx: Context) {
        ctx.patchState({
            accounts: []
        });

        return ctx.dispatch(new LoadAccounts());
    }

    @Action(AuthenticateCurrentAccount)
    authenticateCurrentAccount(ctx: Context) {
        const activeAccount = this.store.selectSnapshot(AccountState.active);

        return ctx.dispatch(new AuthenticateAccount(activeAccount));
    }

    @Action(AuthenticateAccount)
    authenticateAccount(ctx: Context, action: AuthenticateAccount) {
        return this.router.navigate(['/auth', 'verify', action.account.host]);
    }

    @Action(LoadAccounts)
    loadAccounts(ctx: Context) {
        const accounts$ = from(this.getAccounts());

        return accounts$.pipe(
            switchMap((accounts: AccountI[]) => {
                if (this.BIOMETRICS_ENABLED) {
                    if (accounts.length > 0) {
                        return this.auth.biometricAuthentication().pipe(switchMap(() => of(accounts)), catchError(() => of([])));
                    }
                }

                return of(accounts);
            }),
            tap((accounts) => {
                ctx.dispatch(new LoadAccountsSuccess(accounts));
            })
        );
    }

    @Action(LoadAccountsSuccess)
    loadAccountsSuccess(ctx: Context, action: LoadAccountsSuccess) {
        const { accounts } = ctx.getState();

        /**
         * NOTE: we have concatenate exxisting state with newly loaded
         * accounts to make sure that when the accounts are loaded we
         * don't remove the ones from the current session
         *  */
        ctx.patchState({
            accounts: this.mergeWithoutDuplicates(accounts, action.accounts)
        });

        if (action.accounts.length > 0) {
            return ctx.dispatch(new SetActiveAccount(action.accounts[0]));
        }
    }

    @Action(AddAccount)
    addAccount(ctx: Context, action: AddAccount) {
        const accounts = [...ctx.getState().accounts];

        const accountIndex = accounts.findIndex(account => account.host === action.account.host);

        if (accountIndex >= 0) {
            // replace account instance with updated object
            accounts.splice(accountIndex, 1, {
                ...accounts[accountIndex],
                ...action.account
            });
        } else {
            accounts.push(action.account);
        }

        this.updateHttpServiceAccount(action.account);

        return from(new Promise(async (resolve) => {
            if (action.account.remember) {
                await this.rememberAccount(action.account);
            }

            ctx.patchState({
                accounts,
                active: action.account.host
            });

            return resolve();
        }));
    }

    @Action(SetActiveAccount)
    setActiveAccount(ctx: Context, action: SetActiveAccount) {
        const { accounts } = ctx.getState();

        const match = accounts.find(account => account.host === action.account.host);

        // if (!match) {
        //     ctx.patchState({
        //         active: action.account.host,
        //         accounts: [...accounts, action.account]
        //     });
        // }

        this.updateHttpServiceAccount(match || action.account);

        return ctx.dispatch(new LoadApps()).pipe(
            tap(() => {
                ctx.patchState({ active: action.account.host })
            })
        );
    }

    @Action(ClearActiveAccount)
    clearActiveAccount(ctx: Context) {
        ctx.patchState({ active: null });
    }

    @Action(RemoveAccount)
    removeAccount(ctx: Context, action: RemoveAccount) {
        const { accounts } = ctx.getState();

        return from(new Promise(async (resolve) => {
            await this.forgetAccount(action.account);

            const state = {
                accounts: accounts.filter(account => account.host !== action.account.host)
            };

            if (state.accounts.length > 0) {
                await ctx.dispatch(new SetActiveAccount(state.accounts[0])).toPromise();
            }

            ctx.patchState(state);

            resolve();
        }));
    }

    private mergeWithoutDuplicates(primary: AccountI[], secondary: AccountI[]) {
        const list = secondary.filter((account) => {
            return primary.findIndex(acc => acc.host === account.host) === -1;
        });


        return [...primary, ...list];
    }

    private updateHttpServiceAccount(account: AccountI) {
        // update service with account endpoint
        this.http.account = account;
    }

    private async getAccounts() {
        const { value } = await Storage.get({ key: 'accounts' });

        if (!value) {
            return [];
        }

        try {
            return JSON.parse(value);
        } catch (e) {
            return [];
        }
    }

    private async rememberAccount(account: AccountI) {
        const accounts: AccountI[] = await this.getAccounts();

        const accountIndex = accounts.findIndex(a => a.host === account.host);

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1, account);
        } else {
            accounts.push(account);
        }

        await Storage.set({
            key: 'accounts',
            value: JSON.stringify(accounts)
        });
    }

    private async forgetAccount(account: AccountI) {
        const accounts: AccountI[] = await this.getAccounts();

        await Storage.set({
            key: 'accounts',
            value: JSON.stringify(accounts.filter(a => a.host !== account.host))
        });
    }
}