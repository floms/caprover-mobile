import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OneClickAppResolver implements Resolve<any> {
    // export class OneClickAppResolver implements Resolve<Hero> {
    constructor(private service: HttpClient) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.service.get(`https://oneclickapps.caprover.com/v2/apps/${route.paramMap.get('name')}.json`)
    }
}