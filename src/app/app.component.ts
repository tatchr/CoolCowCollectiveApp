import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/authService/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#63b65b');
      this.splashScreen.hide();

      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.storage.get('userId').then(userId => {
            this.subscribeBackButton('/farm-overview/' + userId);
            this.router.navigate(['farm-overview/' + userId], { replaceUrl: true });
          });
        }
        else {
          this.subscribeBackButton('/login');
          this.router.navigate(['login']);
        }
      });
    });
  }

  subscribeBackButton(routeName) {
    this.platform.backButton.subscribe(async () => {
      if (this.router.isActive(routeName, true) && this.router.url === routeName) {
        navigator['app'].exitApp();
      }
    });
  }
}
