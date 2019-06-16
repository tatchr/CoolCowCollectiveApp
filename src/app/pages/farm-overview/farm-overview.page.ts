import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-farm-overview',
  templateUrl: './farm-overview.page.html',
  styleUrls: ['./farm-overview.page.scss'],
})
export class FarmOverviewPage implements OnInit {

  userId:string;
  farmsList:Array<Object>;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute,
    private storage: Storage, private toastController: ToastController, private alertController: AlertController) { }

  ngOnInit() {    
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');    
    this.getAllFarms().subscribe();
  }

  ionViewDidEnter(){
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');    
    this.getAllFarms().subscribe();
  }

  getAllFarms(){
    return this.http.get(environment.url + '/api/farm/getAll/' + this.userId).pipe(
      map(res => {
        this.farmsList = res['farms'];
      }),
      catchError(e => {
        this.showAlert(e.error.errMessage);
        throw new Error(e);
      })
    );
  }

  registerFarm(){
    this.router.navigateByUrl('/register-farm/' + this.userId);
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  clicked(){
    console.log('rr');
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
      duration: 3000
    });
    toast.then(toast => toast.present());
  }

}
