import { Injectable } from '@angular/core';
import { UserSystem, UserApps } from './api-response.i';
import { HttpService, ApiError } from './http.service';
import { hexLogsToArray } from '../modules/shared/util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpService) { }

  getSystemInfo(): Promise<UserSystem.UserSystemInfoI> {
    return this.http.get('/user/system/info')
  }

  changeRootDomain(rootDomain: string, force: boolean) {
    return this.http.post('/user/system/changerootdomain', { rootDomain, force })
  }

  enableSsl(emailAddress: string) {
    return this.http.post('/user/system/enablessl', { emailAddress })
  }

  forceSsl(isEnabled: boolean) {
    return this.http.post('/user/system/forcessl', { isEnabled });
  }

  enableAppSsl(appName: string, customDomain?: string) {
    if (customDomain) {
      return this.enableCustomDomainSsl(appName, customDomain);
    }

    return this.enableBaseDomainSsl(appName);
  }

  enableBaseDomainSsl(appName: string) {
    return this.http.post('/user/apps/appDefinitions/enablebasedomainssl', { appName });
  }

  enableCustomDomainSsl(appName: string, customDomain: string) {
    return this.http.post('/user/apps/appDefinitions/enablecustomdomainssl', { appName, customDomain });
  }

  removeCustomDomain(appName: string, customDomain: string) {
    return this.http.post('/user/apps/appDefinitions/removecustomdomain', { appName, customDomain });
  }

  deleteApp(appName: string, volumes: any[]) {
    return this.http.post('/user/apps/appDefinitions/delete', { appName, volumes });
  }

  getAllApps(): Promise<UserApps.AppDefinitionsI> {
    return this.http.get('/user/apps/appDefinitions');
  }

  async getAppDefinition(appName: string) {
    const apps = await this.getAllApps();

    const match = apps.data.appDefinitions.find(app => app.appName === appName);

    return match;
  }

  registerApp(appName: string, hasPersistentData: boolean) {
    return this.http.post('/user/apps/appDefinitions/register', { appName, hasPersistentData });
  }

  updateAppDef(appDefinition: any) {
    const payload = {};

    const keys = Object.keys(appDefinition);

    const allowed = [
      'appName',
      'captainDefinitionRelativeFilePath',
      'containerHttpPort',
      'description',
      'envVars',
      'forceSsl',
      'instanceCount',
      'notExposeAsWebApp',
      'ports',
      'volumes',
      'websocketSupport',
    ];

    keys.forEach((key) => {
      if (allowed.indexOf(key) >= 0) {
        payload[key] = appDefinition[key];
      }
    })

    return this.http.post('/user/apps/appDefinitions/update', payload);
  }

  fetchBuildLogs(appName: string) {
    return this.http.get(`/user/apps/appData/${appName}`);
  }

  login(password: string) {
    return this.http.post(`/login`, { password }).catch((error) => {
      if (error instanceof ApiError) {
        throw error;
      }

      // create a user friendly error message
      const parts = error.error ? error.error.split(':') : [];

      let message = 'An error has occurred';

      if (parts.length > 0) {
        message = parts.pop();
      }

      throw new ApiError(ApiError.UNKNOWN, message, error);
    });
  }

  updateAppData(appName: string, definition: any) {
    return this.http.post(`/user/apps/appData/${appName}`, definition);
  }

  getVersionInfo() {
    return this.http.get(`/user/system/versioninfo`);
  }

  fetchAppLogsInHex(appName: string) {
    return this.http.get(`/user/apps/appData/${appName}/logs?encoding=hex`);
  }

  async getLogs(appName: string) {

    try {
      const { data } = await this.fetchAppLogsInHex(appName);

      const logLineMapper = (line) => {
        let time;

        try {
          time = new Date(line.substring(0, 30)).getTime()
        } catch (err) {
          // ignore... it's just a failure in fetching logs. Ignore to avoid additional noise in console
        }

        return { time, line };
      };

      const logs = hexLogsToArray(data.logs).map(line => logLineMapper(line))
        .sort((a, b) => a.time > b.time ? 1 : b.time > a.time ? -1 : 0)
        .map(log => log.line).join('');

      return logs;
    } catch (e) { }

    return '';
  }
}
