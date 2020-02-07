import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {  

  constructor(public loadingCtrl: LoadingController) { }

  async presentLoader(loadingId: string, message: string) {
    const loading = await this.loadingCtrl.create({
      id: loadingId,
      message: message,
      spinner: 'circles',
      cssClass: 'custom-loading'
    });
    return await loading.present();
}

  async dismissLoader(loadingId: string) {
      return await this.loadingCtrl.dismiss(null, null, loadingId);
  }
}
