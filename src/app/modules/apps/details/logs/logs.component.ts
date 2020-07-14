import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject, interval, from } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { AppState } from '../../../shared/state/app.state';
import { AppDeployService } from '../../../../services/app-deploy.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit, OnDestroy {
  @Select(AppState.active) app$: Observable<any>;
  logs$: Observable<string>;

  onDestroy$ = new Subject<boolean>();

  constructor(api: AppDeployService, http: ApiService) {
    this.logs$ = interval(1000).pipe(
      switchMap(() => this.app$),
      filter(app => app),
      switchMap(app => from(http.getLogs(app.appName))),
      takeUntil(this.onDestroy$)
    );
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
