import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  loading;

  constructor(private loadingCtrl: LoadingController) { }

  dismissLoading(){
    this.loading.dismiss();
  }

  showOverlay(message){
    return this.loadingCtrl.create({
      message: message
    }).then((overlay) => {
      this.loading = overlay;
      return this.loading.present();
    })
  }
}
