import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import AnsiUp from 'ansi_up';

@Pipe({
  name: 'htmlLogs'
})
export class HtmlLogsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(logs) {
    const ansiUp = new AnsiUp();

    return this.sanitizer.bypassSecurityTrustHtml(ansiUp.ansi_to_html(logs));
  }

}
