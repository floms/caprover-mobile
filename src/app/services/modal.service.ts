import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ModalService {

  constructor(private alertController: AlertController) { }


  async confirm({ header, message, buttons: { cancel, confirm }, inputs = [] }) {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        inputs,
        buttons: [
          {
            text: cancel,
            role: 'cancel',
            handler: (blah) => {
              resolve(false);
            }
          }, {
            text: confirm,
            handler: (selection) => {
              resolve(selection || true);
            }
          }
        ]
      });

      await alert.present();

    });
  }

  async alert({ header, message, buttons: { ok } }) {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: ok,
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();

    });
  }
}
