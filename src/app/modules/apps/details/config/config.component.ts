import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../shared/state/app.state';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { EnvVarModalComponent } from '../../../shared/components/env-var-modal/env-var-modal.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  @Select(AppState.active) app$: Observable<any>;

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async addEnvVar() {
    const modal = await this.modalController.create({
      component: EnvVarModalComponent
    });
    return await modal.present();
  }

}
