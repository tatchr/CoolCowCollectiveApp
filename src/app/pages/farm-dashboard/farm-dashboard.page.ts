import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FarmService } from 'src/app/services/farm/farm.service';
import { Chart } from 'chart.js';

const FARM_ID = 'farmId';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {
  @ViewChild('barChart') barChart;

  farmsList:Array<Object> = [];
  bars: any;
  colorArray: any;

  constructor(private farmService: FarmService, private storage: Storage) { }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
    this.createBarChart();
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

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [{
          label: 'Viewers in millions',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}
