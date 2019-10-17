import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  disableTab: boolean;

  constructor(private storage: Storage) { }

  ngOnInit() { }

  ionViewDidEnter(){
    this.storage.get('farmId').then(farmId => {
      this.disableTab = farmId == null;
    });
  }

}
