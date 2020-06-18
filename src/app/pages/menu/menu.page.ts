import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  disableItem: boolean;

  constructor(private accountService: AccountService, private authService: AuthService, private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {  }

  ionViewDidEnter(){
    this.disableItem = !this.accountService.userHasFarm;
  }

  logout() {
    this.authService.logout();
  }

  clearToken() {
    // ONLY FOR TESTING!
    this.storage.remove('access_token');
    this.storage.remove('userId');

    let toast = this.toastController.create({
      message: 'JWT removed',
      showCloseButton: true,
      duration: 2000
    });
    toast.then(toast => toast.present());
  }

  clearFarmId() {
    // ONLY FOR TESTING!
    this.storage.remove('farmId');

    let toast = this.toastController.create({
      message: 'farmId removed',
      showCloseButton: true,
      duration: 2000
    });
    toast.then(toast => toast.present());
  }
}
