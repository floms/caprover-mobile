import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';

import { UserApps } from '../../../services/api-response.i'
import { ApiService } from '../../../services/api.service';
import { from, } from 'rxjs';
import { Deployment, StartOneClickAppDeployment, DeploymentStep, AddDeploymentStep, UpdateDeploymentStep, StartDeploymentBatch, StartSingleDeployment, CompleteDeployment } from './deployment.actions';
import { ConfigParser } from '../util';
import { LoadApps } from './app.actions';
import { DeploymentStateModel } from './deployment.i';
import { ApiError } from '../../../services/http.service';

type Context = StateContext<DeploymentStateModel>;

@State<DeploymentStateModel>({
    name: 'deployment',
    defaults: {
        instructions: {
            start: '',
            end: '',
        },
        active: false,
        steps: [],
        deployments: [],
    }
})
@Injectable()
export class DeploymentState {
    @Selector()
    static info(state: DeploymentStateModel) {
        return state.steps;
    }

    @Selector()
    static error(state: DeploymentStateModel) {
        return state.steps.find((step) => step.error);
    }

    @Selector()
    static instructions(state: DeploymentStateModel) {
        return state.instructions;
    }


    @Selector()
    static steps(state: DeploymentStateModel) {
        return state.steps;
    }

    @Selector()
    static inProgress(state: DeploymentStateModel) {
        return state.active;
    }

    constructor(private api: ApiService) { }

    @Action(StartOneClickAppDeployment)
    startOneClickDeployment(ctx: Context, action: StartOneClickAppDeployment) {
        const parser = new ConfigParser(action.config);

        ctx.patchState({
            active: true,
            instructions: {
                start: parser.parse(action.appDefinition.instructions.start),
                end: parser.parse(action.appDefinition.instructions.end)
            }
        });

        const services = action.appDefinition.dockerCompose.services;

        const deployments = Object.keys(services).map((serviceKey: string) => {

            const service = services[serviceKey];

            const appName = parser.parse(serviceKey);

            ctx.dispatch(new AddDeploymentStep(DeploymentStep.REGISTER, appName));
            ctx.dispatch(new AddDeploymentStep(DeploymentStep.CONFIGURE, appName));
            ctx.dispatch(new AddDeploymentStep(DeploymentStep.DEPLOY, appName));

            const volumes = service.volumes || [];

            const updatedConfig: Partial<UserApps.DefinitionI> = {};

            if (service.containerHttpPort) {
                updatedConfig.containerHttpPort = +parser.parse(service.containerHttpPort);
            }

            const environment = service.environment || {};

            const environmentKeys = Object.keys(environment);

            if (environmentKeys.length > 0) {
                updatedConfig.envVars = [];

                environmentKeys.forEach(envKey => {
                    updatedConfig.envVars.push({
                        key: parser.parse(envKey),
                        value: parser.parse(environment[envKey])
                    })
                });
            }

            if (volumes.length > 0) {
                updatedConfig.volumes = [];

                volumes.forEach(volume => {
                    const [volumeName, containerPath] = volume.split(':');

                    updatedConfig.volumes.push({
                        volumeName: parser.parse(volumeName),
                        containerPath: parser.parse(containerPath)
                    })
                });
            }

            const captainDefinitionContent = {
                schemaVersion: 2,
                imageName: '',
                dockerfileLines: []
            };

            if (service.dockerfileLines) {
                delete captainDefinitionContent.imageName;
                captainDefinitionContent.dockerfileLines = service.dockerfileLines.map(line => parser.parse(line));
            } else {
                delete captainDefinitionContent.dockerfileLines;
                captainDefinitionContent.imageName = parser.parse(service.image);
            }

            let definition = {
                captainDefinitionContent: JSON.stringify(captainDefinitionContent),
                gitHash: ''
            };

            return {
                appName, volumes, updatedConfig, definition
            };
        });


        ctx.patchState({
            deployments: deployments,
        });

        return ctx.dispatch(new StartDeploymentBatch());
    }

    @Action(AddDeploymentStep)
    addDeploymentStep(ctx: Context, action: AddDeploymentStep) {
        const { steps } = ctx.getState();

        const deploymentSteps = [...steps];


        let label = `Registering ${action.appName}`;

        switch (action.step) {
            case DeploymentStep.CONFIGURE:
                label = `Configuring ${action.appName} (volumes, ports, environmental variables)`;
                break;
            case DeploymentStep.DEPLOY:
                label = `Deploying ${action.appName} (might take up to a minute)`;
        }

        deploymentSteps.push({
            appName: action.appName,
            step: action.step,
            complete: undefined,
            label,
            error: undefined,
            message: ''
        });


        ctx.patchState({
            steps: deploymentSteps
        })
    }

    @Action(UpdateDeploymentStep)
    updateDeploymentStep(ctx: Context, action: UpdateDeploymentStep) {
        const steps = [...ctx.getState().steps];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];

            if (step.appName === action.appName) {
                if (step.step === action.step || action.step === DeploymentStep.ANY) {
                    steps[i] = {
                        ...step,
                        complete: action.complete,
                        error: action.error,
                        message: action.message,
                    };

                    break;
                }
            }
        }

        ctx.patchState({ steps });
    }

    @Action(CompleteDeployment)
    completeDeployment(ctx: Context) {
        ctx.patchState({
            instructions: {
                start: '',
                end: ''
            },
            active: false,
            deployments: [],
            steps: [],
        });

        return ctx.dispatch(new LoadApps());
    }

    async executeDeployment(ctx: Context, dep: Deployment) {
        ctx.patchState({
            active: true
        });

        try {
            const registerStart = new UpdateDeploymentStep(DeploymentStep.REGISTER, dep.appName, false);
            ctx.dispatch(registerStart);
            await this.api.registerApp(dep.appName, dep.volumes.length > 0);
            // await this.tester(1);

            const registerComplete = new UpdateDeploymentStep(DeploymentStep.REGISTER, dep.appName, true);
            ctx.dispatch(registerComplete);


            const configureStart = new UpdateDeploymentStep(DeploymentStep.CONFIGURE, dep.appName, false);
            ctx.dispatch(configureStart);

            const definition = await this.api.getAppDefinition(dep.appName);
            await this.api.updateAppDef({ ...definition, ...dep.updatedConfig });
            // await this.tester(1);

            const configureComplete = new UpdateDeploymentStep(DeploymentStep.CONFIGURE, dep.appName, true);
            ctx.dispatch(configureComplete);

            const deployStart = new UpdateDeploymentStep(DeploymentStep.DEPLOY, dep.appName, false);
            ctx.dispatch(deployStart);

            await this.api.updateAppData(dep.appName, dep.definition);
            // await this.tester(1);

            const deployComplete = new UpdateDeploymentStep(DeploymentStep.DEPLOY, dep.appName, true);
            ctx.dispatch(deployComplete);
        } catch (error) {

            const errorMessage = error instanceof ApiError ? error.message : 'An error occurred';

            const errorReport = new UpdateDeploymentStep(DeploymentStep.ANY, dep.appName, undefined, true, errorMessage);
            ctx.dispatch(errorReport);

            throw error;
        }
    }

    @Action(StartDeploymentBatch)
    startDeployments(ctx: Context) {
        const { deployments } = ctx.getState();

        return from((async () => {
            for (let i = 0; i < deployments.length; i++) {
                try {
                    await this.executeDeployment(ctx, deployments[i]);
                } catch (error) {
                    break;
                }
            }

            ctx.patchState({
                active: false
            });
        })());
    }
}
