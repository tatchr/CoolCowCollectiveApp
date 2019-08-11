import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-herd',
  templateUrl: './herd.page.html',
  styleUrls: ['./herd.page.scss'],
})
export class HerdPage implements OnInit {

  farmId:string;
  cowsList:Array<Object> = [];

  constructor(private cowService: CowService, private storage: Storage) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.getAllCows();
    });    
  }

  getAllCows(){
    this.cowService.getAllCows(this.farmId).subscribe(res => {
      this.cowsList = res['cows'];
    });
  }

}
