import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { from, interval } from 'rxjs';
import { map, switchMap, tap, startWith } from 'rxjs/operators';

import {
  default as AnsiUp
} from 'ansi_up';


@Injectable({
  providedIn: 'root'
})
export class AppDeployService {

  constructor(private api: ApiService) { }


  getLogs(appName: string) {
    const separators = [
      '00000000',
      '01000000',
      '02000000',
      '03000000', // This is not in the Docker docs, but can actually happen when the log stream is broken https://github.com/caprover/caprover/issues/366
    ]

    function convertHexStringToUtf8(raw) {
      if (!raw) {
        return '';
      }
      return decodeURIComponent(raw.substring(8, raw.length).replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
    }


    return interval(1000).pipe(
      startWith(''),
      switchMap(() => this.api.fetchAppLogsInHex(appName)),
      map(e => {
        const logsHex = e.data.logs;

        const logs = logsHex.split(new RegExp(separators.join('|'), 'g'))
          .map((rawRow) => {
            let time = 0

            let textUtf8 = convertHexStringToUtf8(rawRow)

            try {
              time = new Date(textUtf8.substring(0, 30)).getTime()
            } catch (err) {
              // ignore... it's just a failure in fetching logs. Ignore to avoid additional noise in console
            }

            return {
              text: textUtf8,
              time: time,
            }
          })
          .sort((a, b) =>
            a.time > b.time ? 1 : b.time > a.time ? -1 : 0
          )
          .map(e => e.text)
          .join('');

        // const s = logs.replace(getAnsiColorRegex(), '');
        const s = logs;

        const ansi_up = new AnsiUp();
        return ansi_up.ansi_to_html(s);
      })
    );
  }
}
