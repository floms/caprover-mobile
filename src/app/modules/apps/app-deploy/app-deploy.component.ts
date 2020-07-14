import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { withLatestFrom, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { RegisterApp } from '../../shared/state/app.actions';
import { AppState } from '../../shared/state/app.state';
import { UIService } from '../../../services/ui.service';
import { AlertController } from '@ionic/angular';
import { StartOneClickAppDeployment } from '../../shared/state/deployment.actions';
import { DeploymentState } from '../../shared/state/deployment.state';
import { regexValidator } from '../../shared/util';

@Component({
  selector: 'app-new',
  templateUrl: './app-deploy.component.html',
  styleUrls: ['./app-deploy.component.scss'],
})
export class AppDeployComponent implements OnInit {
  @Select(AppState.active) app$;

  @Select(DeploymentState.inProgress) deploymentInProgress$;
  @Select(DeploymentState.steps) deploymentSteps$: Observable<any[]>;
  @Select(DeploymentState.error) error$: Observable<any>;
  @Select(DeploymentState.instructions) instructions$: Observable<any>;

  newAppForm: FormGroup;
  pageTitle$ = new BehaviorSubject<string>('Setup your New App');

  formFields = [
    {
      id: '$$cap_appname',
      label: 'App Name',
      description: 'This is your app name. Pick a name such as my-first-1-click-app',
      placeholder: 'my-first-1-click-app'
    }
  ];

  oneClickApp: any;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private fb: FormBuilder,
    private ui: UIService,
    private alertController: AlertController,
  ) {
    const { rootDomain } = this.store.selectSnapshot(AppState.system);

    this.newAppForm = this.fb.group({
      '$$cap_root_domain': [rootDomain],
      '$$cap_appname': ['', regexValidator('/^([a-z0-9]+\-)*[a-z0-9]+$/')],
      persistentData: [false]
    });

    if (this.oneClickApp = route.snapshot.data.app) {
      this.setupOneClickApp();
    }
  }

  ngOnInit() { }

  persistentData() {
    window.open('https://caprover.com/docs/persistent-apps.html');
  }

  async deploy() {
    if (this.newAppForm.invalid) {
      return;
    }

    const values = this.newAppForm.value;

    if (this.oneClickApp) {
      this.pageTitle$.next(`Configuring your ${this.oneClickApp.displayName}`);

      const deploymentAction = new StartOneClickAppDeployment(this.oneClickApp, values);

      return this.store.dispatch(deploymentAction).subscribe(() => { });
    }

    await this.ui.show('Processing');

    const { $$cap_appname, persistentData } = values;

    this.store.dispatch(new RegisterApp($$cap_appname, !!persistentData)).pipe(
      withLatestFrom(this.app$),
      catchError(error => {
        this.ui.dismiss();

        this.alertController.create({
          header: 'Error',
          message: error.message,
          buttons: ['OK']
        }).then(alert => alert.present())

        return throwError(error);
      })
    ).subscribe(async ([_, app]: any) => {
      if (app && app.appName === $$cap_appname) {
        await this.router.navigate(['apps', app.appName], {
          replaceUrl: true
        });

      }

      this.ui.dismiss();
    });

  }

  finish() {
    this.router.navigate(['/apps']);
  }

  private setupOneClickApp() {
    this.pageTitle$.next(`Setup ${this.oneClickApp.displayName}`);

    this.oneClickApp.variables.forEach((variable) => {
      const validators = []

      if (variable.validRegex) {
        validators.push(regexValidator(variable.validRegex));
      }

      const control = new FormControl(variable.defaultValue, validators);

      this.newAppForm.addControl(variable.id, control);

      this.formFields.push({
        id: variable.id,
        label: variable.label,
        description: variable.description,
        placeholder: variable.label
      });
    });
  }
}