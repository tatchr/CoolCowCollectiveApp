import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FarmService } from 'src/app/services/farm/farm.service';

const FARM_ID = 'farmId';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {

  farmsList:Array<Object> = [];

  constructor(private farmService: FarmService, private storage: Storage) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.storage.get('userId').then(userId => {
      this.getAllFarms(userId);
    });    
  }

  getAllFarms(userId){
    this.farmService.getAllFarms(userId).subscribe(res => {
        this.farmsList = res['farms'];        
        if(this.farmsList.length > 0){
          this.storage.set(FARM_ID, res['farms'][0]['farmId'])
        }
    });
  }
}
