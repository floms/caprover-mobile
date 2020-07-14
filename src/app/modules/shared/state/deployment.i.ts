import { DeploymentStep, Deployment } from './deployment.actions';

export interface DeploymentI {
    step: DeploymentStep;
    appName: string;
    complete: boolean;
    label: string;
    error: boolean;
    message: string;
}

export interface InstructionsI {
    start: string;
    end: string;
}

export interface DeploymentStateModel {
    instructions: InstructionsI;
    active: boolean;
    steps: DeploymentI[];
    deployments: Deployment[];
}