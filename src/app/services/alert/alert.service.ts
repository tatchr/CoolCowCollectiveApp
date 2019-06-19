import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'An error occured',
      subHeader: 'Subtitle',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}
