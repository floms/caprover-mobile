import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';

import { ApiService } from '../../../services/api.service';
import { LoadAppsSuccess, LoadApps, SetActiveApp, LoadSystemInfo, RegisterApp, EnableAppDomainSsl, DeleteApp, RemoveCustomDomain, UpdateAppConfig } from './app.actions';
import { from, throwError } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { AppStateModel } from './app.i';
import { ApiErrorCode } from '../../../services/http-api.code';
import { AuthenticateCurrentAccount } from './account.actions';

type Context = StateContext<AppStateModel>;

@State<AppStateModel>({
    name: 'root',
    defaults: {
        info: {
            rootDomain: null,
            hasRootSsl: false,
            forceSsl: false,
        },
        appDefinition: {
            appDefinitions: [],
            rootDomain: null,
            defaultNginxConfig: null
        },
        activeApp: null
    }
})
@Injectable()
export class AppState {
    @Selector()
    static definition(state: AppStateModel) {
        return state.appDefinition;
    }

    @Selector()
    static apps(state: AppStateModel) {
        return state.appDefinition.appDefinitions;
    }

    @Selector()
    static system(state: AppStateModel) {
        return state.info;
    }

    @Selector()
    static active(state: AppStateModel) {
        return state.appDefinition.appDefinitions.find(app => app.appName === state.activeApp);
    }

    constructor(private api: ApiService) { }

    @Action(LoadApps)
    loadApps(ctx: Context) {
        ctx.dispatch(new LoadSystemInfo());

        return from(this.api.getAllApps()).pipe(
            map(def => def.data),
            tap({
                next: (data) => {
                    ctx.dispatch(new LoadAppsSuccess(data))
                },
                error: (error) => {
                    if (error.code === ApiErrorCode.STATUS_AUTH_TOKEN_INVALID) {
                        ctx.dispatch(new AuthenticateCurrentAccount())
                    }
                }
            })
        );
    }

    @Action(LoadAppsSuccess)
    loadAppsSuccess(ctx: Context, action: LoadAppsSuccess) {
        ctx.patchState({
            appDefinition: action.appDefinition
        });
    }

    @Action(SetActiveApp)
    setActiveApp(ctx: Context, action: SetActiveApp) {
        ctx.patchState({
            activeApp: action.appName
        });
    }

    @Action(RegisterApp)
    registerApp(ctx: Context, action: RegisterApp) {
        return from(this.api.registerApp(action.appName, action.hasPersistentData)).pipe(
            tap(() => {
                ctx.patchState({
                    activeApp: action.appName
                });
            }),
            switchMap(() => ctx.dispatch(new LoadApps()))
        )
    }

    @Action(LoadSystemInfo)
    loadSystemInfo(ctx: Context, action: SetActiveApp) {
        return from(this.api.getSystemInfo()).pipe(
            tap((info) => {
                ctx.patchState({
                    info: info.data
                });
            })
        );
    }

    @Action(EnableAppDomainSsl)
    enableBaseDomainSsl(ctx: Context, action: EnableAppDomainSsl) {
        return from(this.api.enableAppSsl(action.appName, action.customDomain)).pipe(
            switchMap(() => ctx.dispatch(new LoadApps()))
        );
    }

    @Action(DeleteApp)
    deleteApp(ctx: Context, action: DeleteApp) {
        return from(this.api.deleteApp(action.appName, action.volumes)).pipe(
            switchMap(() => ctx.dispatch(new LoadApps()))
        );
    }

    @Action(RemoveCustomDomain)
    removeCustomDomain(ctx: Context, action: RemoveCustomDomain) {
        return from(this.api.removeCustomDomain(action.appName, action.customDomain)).pipe(
            switchMap(() => ctx.dispatch(new LoadApps()))
        );
    }

    @Action(UpdateAppConfig)
    udpateAppConfig(ctx: Context, action: UpdateAppConfig) {
        const { appDefinition: { appDefinitions } } = ctx.getState();

        const targetApp = appDefinitions.find((app) => app.appName === action.appName);

        if (!targetApp) {
            return throwError(`Invalid App Name`);
        }

        const config = {
            ...targetApp,
            ...action.config
        };

        return from(this.api.updateAppDef(config)).pipe(
            switchMap(() => ctx.dispatch(new LoadApps()))
        );
    }
}
