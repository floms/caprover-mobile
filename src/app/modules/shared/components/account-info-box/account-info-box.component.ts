import { Component, OnInit, Input } from '@angular/core';
import { AccountI } from '../../state/account.i';

@Component({
  selector: 'app-account-info-box',
  templateUrl: './account-info-box.component.html',
  styleUrls: ['./account-info-box.component.scss'],
})
export class AccountInfoBoxComponent implements OnInit {
  @Input() account: AccountI;

  constructor() { }

  ngOnInit() {}

}
