import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { DeploymentState } from '../modules/shared/state/deployment.state';
import { map, tap } from 'rxjs/operators';
import { ModalService } from './modal.service';
import { CompleteDeployment } from '../modules/shared/state/deployment.actions';

@Injectable({
  providedIn: 'root'
})
export class DeploymentGuard implements CanDeactivate<unknown> {
  @Select(DeploymentState.steps) steps$: Observable<any[]>;
  @Select(DeploymentState.inProgress) inProgress$;

  constructor(private modal: ModalService, private store: Store) { }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return combineLatest(this.steps$, this.inProgress$).pipe(
      map(([steps, inProgress]) => {
        if (steps.length === 0) {
          return true;
        }



        return !inProgress;
      }),
      tap(navigate => {
        if (!navigate) {
          return this.modal.alert({
            header: 'In Progress',
            message: 'There is a deployment in progress. Wait for it to complete before navigating away',
            buttons: {
              ok: 'OK'
            }
          })
        }

        // when the user navigates away that means the deployment has completed
        this.store.dispatch(new CompleteDeployment());
      })
    );
  }

}
