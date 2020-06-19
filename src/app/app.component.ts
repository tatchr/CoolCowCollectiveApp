import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/authService/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { FarmService } from 'src/app/services/farm/farm.service';
import { UserDetails } from './common/objects/UserDetails';

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
    private router: Router,
    private farmService: FarmService
  ) {
    this.initializeApp();
  }

  showSplash: boolean = true;

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#63b65b');
      this.splashScreen.hide();

      timer(1000).subscribe(() => this.showSplash = false);

      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.storage.get('userDetails').then((user: UserDetails) => {
            this.subscribeBackButton('/tabs/farm-dashboard');
            this.subscribeBackButton('/tabs/milk-entry');
            this.subscribeBackButton('/tabs/herd');
            this.subscribeBackButton('/tabs/menu');
            this.subscribeBackButton('/tabs/milk-sales-overview');
            this.subscribeBackButton('/tabs/other-sales-overview');
            this.subscribeBackButton('/tabs/expenses-menu');

            if(user.hasFarm){
              this.farmService.loadFarm(user.id).then(() =>{
                this.router.navigate(['tabs/farm-dashboard'], { replaceUrl: true });
              });
            }
            else{              
              this.router.navigate(['tabs/new-farm'], { replaceUrl: true });
            }             
            
          });
        } else {
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