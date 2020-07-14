import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../../shared/state/app.state';
import { Observable, combineLatest, pipe } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { EnableAppDomainSsl, DeleteApp, RemoveCustomDomain, UpdateAppConfig } from '../../../shared/state/app.actions';
import { UIService } from '../../../../services/ui.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-http',
  templateUrl: './http.component.html',
  styleUrls: ['./http.component.scss'],
})
export class HttpComponent implements OnInit {
  @Select(AppState.active) app$: Observable<any>;
  @Select(AppState.system) system$: Observable<any>;

  urls$ = combineLatest(this.app$, this.system$).pipe(
    map(([app, system]) => {

      const urls = [
        {
          domain: `${app.appName}.${system.rootDomain}`,
          ssl: app.hasDefaultSubDomainSsl,
          default: true
        }
      ];


      app.customDomain.forEach((domain) => {
        urls.push({
          domain: domain.publicDomain,
          ssl: domain.hasSsl,
          default: false,
        })
      });

      return urls;
    })
  );

  constructor(
    private ui: UIService,
    private router: Router,
    private store: Store,
    private modal: ModalService,
  ) { }

  enableSsl(appName: string, domain: string, baseDomain: boolean) {
    this.ui.show();

    this.store.dispatch(new EnableAppDomainSsl(appName, baseDomain ? null : domain))
      .pipe(
        withLatestFrom(this.app$)
      )
      .subscribe(([_, app]) => {
        this.ui.dismiss();
        if (!app.hasDefaultSubDomainSsl) {
          // handle error
        }
        // display success message
      });
  }

  exposeWebApp(appName: string, expose: boolean) {
    this.ui.show();
    this.store.dispatch(new UpdateAppConfig(appName, { notExposeAsWebApp: !expose }))
      .subscribe(() => {
        this.ui.dismiss();

      });
  }


  removeCustomDomain(appName: string, domain: string) {
    this.ui.show();

    this.store.dispatch(new RemoveCustomDomain(appName, domain))
      .pipe(
        withLatestFrom(this.app$)
      )
      .subscribe(([_, app]) => {
        this.ui.dismiss();
      });
  }

  async deleteApp(app: any) {
    let message = `
      You are about to delete <code>${app.appName}</code>. Please note that this action
      is <strong>PERMANENT</strong>  and <strong>not reversible</strong>.
    `

    let availableVolumes = [];

    if (app.volumes && app.volumes.length > 0) {
      message += `
        <p>
          Please select the volumes you want to delete. Note that if any of the volumes are being used by other
          CapRover apps, they will not be deleted even if you select them. <strong>Note:</strong> deleting volumes
          takes more than 10 seconds, please be patient
        </p>
      `;

      app.volumes.forEach(volume => {
        availableVolumes.push({
          name: volume.volumeName,
          type: 'checkbox',
          label: volume.volumeName,
          value: volume.volumeName,
          checked: true
        })
      });
    }

    const confirm = await this.modal.confirm({
      header: `Are You Sure?`,
      message,
      inputs: availableVolumes,
      buttons: {
        cancel: 'Cancel',
        confirm: 'DELETE'
      }
    });

    if (confirm) {
      this.ui.show();

      const volumes = Array.isArray(confirm) ? confirm : [];

      this.store.dispatch(new DeleteApp(app.appName, volumes))
        .pipe(
          withLatestFrom(this.app$)
        )
        .subscribe(([_, app]) => {
          if (app) {
            // handle error: app was not deleted
            return {};
          }

          this.ui.dismiss();

          // TODO:
          // display success message: toast
          this.router.navigate(['apps'], { replaceUrl: true });
        })
    }

  }

  ngOnInit() { }

}
