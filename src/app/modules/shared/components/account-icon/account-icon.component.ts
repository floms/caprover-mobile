import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AccountI } from '../../state/account.i';

@Component({
  selector: 'app-account-icon',
  templateUrl: './account-icon.component.html',
  styleUrls: ['./account-icon.component.scss'],
})
export class AccountIconComponent implements OnInit, OnChanges {
  @Input() account: AccountI;
  label = 'CR';

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.account) {
      this.updateLabel();
    }
  }

  updateLabel() {
    const parts = this.account.host.split('.');

    // remove the captain subdomain
    parts.shift();

    // remove the TLD
    parts.pop();

    if (parts.length > 0) {
      this.label = parts.reduce((label, part) => label + part.substr(0, 1), '');
    }
  }

}
