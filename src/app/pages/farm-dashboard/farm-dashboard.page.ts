import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FarmService } from 'src/app/services/farm/farm.service';

const FARM_ID = 'farmId';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {

  userId:string;
  farmsList:Array<Object> = [];

  constructor(private farmService: FarmService, private router: Router, private storage: Storage) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.storage.get('userId').then(userId => {
      this.userId = userId;
      this.getAllFarms();
    });    
  }

  getAllFarms(){
    this.farmService.getAllFarms(this.userId).subscribe(res => {
      this.farmsList = res['farms'];
      this.storage.set(FARM_ID, res['farms'][0]['id'])
    });
  }

  registerFarm(){
    this.router.navigateByUrl('/register-farm');
  }

}
