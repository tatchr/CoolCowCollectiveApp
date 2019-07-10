import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FarmService } from 'src/app/services/farm/farm.service';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {

  userId:string;
  farmsList:Array<Object> = [];

  constructor(private authService: AuthService, private farmService: FarmService, private router: Router, 
    private activatedRoute: ActivatedRoute, private storage: Storage, private toastController: ToastController) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');    
    this.getAllFarms();
  }

  getAllFarms(){
    this.farmService.getAllFarms(this.userId).subscribe(res => {
      this.farmsList = res['farms'];
    });
  }

  registerFarm(){
    this.router.navigateByUrl('/register-farm/' + this.userId);
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
