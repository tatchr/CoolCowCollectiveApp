import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  showAlert(header, msg, buttons) {
    let alert = this.alertController.create({
      header: header,
      message: msg,      
      buttons: buttons
    });
    alert.then(alert => alert.present());
  }  
 
  async presentAlertConfirm(header, message, confirmHandler) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Yes',
          handler: confirmHandler
        }
      ]
    });

    await alert.present();
  }
}
