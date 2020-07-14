import { UserApps } from '../../../services/api-response.i';

export interface Deployment {
    appName: string;
    volumes: any[],
    updatedConfig: Partial<UserApps.DefinitionI>;
    definition: any;
}

export enum DeploymentStep {
    ANY = 'ANY',
    REGISTER = 'REGISTER',
    CONFIGURE = 'CONFIGURE',
    DEPLOY = 'DEPLOY',
}


export class StartOneClickAppDeployment {
    static readonly type = '[Deployment] Start One Click';
    constructor(public appDefinition: any, public config: any) { }
}

export class StartDeploymentBatch {
    static readonly type = '[Deployment] Start Batch';
    constructor() { }
}

export class StartSingleDeployment {
    static readonly type = '[Deployment] Start';
    constructor(public deployment: Deployment) { }
}

export class AddDeploymentStep {
    static readonly type = '[Deployment] Add Step';
    constructor(public step: DeploymentStep, public appName: string, public label?: string) { }
}

export class UpdateDeploymentStep {
    static readonly type = '[Deployment] Update Step';
    constructor(public step: DeploymentStep, public appName: string, public complete: boolean, public error?: boolean, public message?: string) { }
}

export class CompleteDeployment {
    static readonly type = '[Deployment] Complete';
    constructor() { }
}
