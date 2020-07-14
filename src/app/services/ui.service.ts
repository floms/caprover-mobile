import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

export interface AlertConfigI {
  title: string;
  message: string;
  buttons?: { ok: string }
}

@Injectable({
  providedIn: 'root'
})
export class UIService {

  modal: any;

  constructor(private loadingController: LoadingController, private alertController: AlertController) {
    this.createModal();
  }

  async createModal(message?: string) {
    this.modal = await this.loadingController.create({
      message: message || 'Please wait...',
    });
  }

  async show(message?: string) {
    await this.createModal(message);

    await this.modal.present();
  }

  async alert(config: AlertConfigI) {
    const alert = await this.alertController.create({
      header: config.title,
      message: config.message,
      buttons: [
        config.buttons ? config.buttons.ok :  'OK'
      ]
    });

    await alert.present();
  }

  async dismiss() {
    await this.loadingController.dismiss();
  }
}
