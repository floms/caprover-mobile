import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-one-click-list',
  templateUrl: './one-click-list.component.html',
  styleUrls: ['./one-click-list.component.scss'],
})
export class OneClickListComponent implements OnInit {
  apps$: Observable<any[]>
  search$ = new BehaviorSubject<string>(null);
  records$ = this.http.get('https://oneclickapps.caprover.com/v2/autoGeneratedList.json').pipe(
    map((response: any) => response.appDetails),
    shareReplay()
  );

  constructor(private http: HttpClient, private router: Router) {
    this.apps$ = combineLatest(this.records$, this.search$).pipe(
      map(([apps, keyword]) => {
        if (keyword) {
          return apps.filter(({ displayName, description }) => {
            return displayName.toUpperCase().indexOf(keyword) >= 0 || description.toUpperCase().indexOf(keyword) >= 0;
          })

        }

        return apps;
      })
    );
  }

  ngOnInit() { }


  onSearch(event: any) {
    const text = event.target.value.toUpperCase();

    this.search$.next(text);
  }

  deploy(app: any) {
    this.router.navigate(['/apps', 'new', app.name]);
  }
}
