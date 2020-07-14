import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { AppState } from '../../shared/state/app.state';
import { LoadApps, SetActiveApp } from '../../shared/state/app.actions';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  @Select(AppState.active) app$: Observable<any>;

  onDestroy$ = new Subject<boolean>();

  constructor(route: ActivatedRoute, store: Store) {
    const appId = route.snapshot.paramMap.get('id');

    this.app$.pipe(takeUntil(this.onDestroy$)).subscribe((app) => {
      if (!app) {
        store.dispatch(new LoadApps());
        store.dispatch(new SetActiveApp(appId));
      }
    })
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  ngOnInit() { }

}
