import { UserApps } from '../../../services/api-response.i';

export class LoadApps {
    static readonly type = '[App] Load Apps';
    constructor() { }
}

export class LoadSystemInfo {
    static readonly type = '[App] Load System Info';
    constructor() { }
}

export class LoadAppsSuccess {
    static readonly type = '[App] Load Apps Success';
    constructor(public appDefinition: UserApps.AppDefinitionDataI) { }
}

export class SetActiveApp {
    static readonly type = '[App] Set Active App';
    constructor(public appName: string) { }
}


export class EnableAppDomainSsl {
    static readonly type = '[App] Enable App Domain SSL';
  
    constructor(public appName: string, public customDomain: string) { }
}

export class RemoveCustomDomain {
    static readonly type = '[App] Remove Custom Domain';
    constructor(public appName: string, public customDomain: string) { }
}

export class DeleteApp {
    static readonly type = '[App] Delete App';
    constructor(public appName: string, public volumes: any[]) { }
}

export class UpdateAppConfig {
    static readonly type = '[App] UpdateAppConfig';
  
    constructor(public appName: string, public config: Partial<UserApps.DefinitionI>) { }
}


export class RegisterApp {
    static readonly type = '[App] Register App';
    constructor(public appName: string, public hasPersistentData: boolean) { }
}

export class RegisterAppSuccess {
    static readonly type = '[App] Register App Success';
    constructor(public appName: string) { }
}