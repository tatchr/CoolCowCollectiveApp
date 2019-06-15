import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farm-overview',
  templateUrl: './farm-overview.page.html',
  styleUrls: ['./farm-overview.page.scss'],
})
export class FarmOverviewPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  clicked(){
    console.log('rr');
  }

}
