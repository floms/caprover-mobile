import { UserSystem, UserApps } from '../../../services/api-response.i';

export interface AppStateModel {
    info: UserSystem.InfoI;
    appDefinition: UserApps.AppDefinitionDataI;
    activeApp: String;
}