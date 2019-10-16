import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private authService: AuthService, private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {
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
}
