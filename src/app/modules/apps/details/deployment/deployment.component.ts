import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../../shared/state/app.state';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss'],
})
export class DeploymentComponent implements OnInit, OnDestroy {
  @Select(AppState.active) app$: Observable<any>;
  deployments$: Observable<any[]>;

  onDestroy$ = new Subject<boolean>();

  constructor(private store: Store) {
    this.deployments$ = this.store.select(AppState.active).pipe(
      map((app) => app.versions.map(version => ({ ...version, timeStamp: new Date(version.timeStamp) }))),
      map((versions) => versions.sort((a, b) => a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0)),
    );
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
