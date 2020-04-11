import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FarmService } from 'src/app/services/farm/farm.service';
import * as Chart from 'chart.js';
import { MilkService } from 'src/app/services/milk/milk.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { MilkProductionDetails } from 'src/app/common/objects/MilkProductionDetails';

const FARM_ID = 'farmId';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {
  @ViewChild('cowPodiumChart') cowPodiumChart;

  farmsList: Array<Object> = [];
  bars: any;
  colorArray: any;
  farmId: string;

  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());

  constructor(private farmService: FarmService, private storage: Storage, private milkService: MilkService, private datePicker: DatepickerService) { }

  ngOnInit() {
    this.initiate();
  }

  initiate() {
    this.storage.get('userId').then(userId => {
      this.getAllFarms(userId);      
      //this.createBarChart();
    });

    this.milkService.milkRecordsLoaded.subscribe(finishedLoading =>{
      if(finishedLoading){    
        console.log(this.milkService.allMilkRecordsList);    
        this.createMilkProductionChart();
      }
    });

    this.milkService.milkRecordsUpdated.subscribe(() => {
      console.log(this.milkService.allMilkRecordsList);
      this.createMilkProductionChart();
    });
  }

  getAllFarms(userId) {
    this.farmService.getAllFarms(userId).subscribe(res => {
      this.farmsList = res['farms'];
      if (this.farmsList.length > 0) {
        this.storage.set(FARM_ID, res['farms'][0]['farmId']);
        this.farmId = res['farms'][0]['farmId'];
      }
    });
  }

  getMilkAmount(timeOfDay) {
    let milkRecords = this.milkService.getMilkRecordsFromDateToDate(timeOfDay, this.selectedFromDate, this.selectedToDate);
    let days: String[] = this.datePicker.getDaysArray(this.selectedFromDate, this.selectedToDate);

    let milkTotals = [];
    days.forEach(day => {
      let milkOnDay = milkRecords.filter(x => this.datePicker.formatDate2(x.date, 'MMM-DD') == day);

      if (milkOnDay.length == 0) {
        milkTotals.push(Number.NaN);
      }
      else {
        let milkSumOnDay = milkOnDay.reduce((a, b) => a + b.amount, 0);
        milkTotals.push(milkSumOnDay);
      }
    });

    return milkTotals;
  }

  @ViewChild('milkProductionChart') milkProductionChart;
  lines: Chart;
  createMilkProductionChart() {
    this.lines = new Chart(this.milkProductionChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.datePicker.getDaysArray(this.selectedFromDate, this.selectedToDate),
        datasets: [
          {
            label: 'Morning',
            data: this.getMilkAmount('Morning'),
            borderColor: 'blue',
            fill: false,
            lineTension: 0,
            pointRadius: 0
          },
          {
            label: 'Afternoon',
            data: this.getMilkAmount('Afternoon'),
            borderColor: 'orange',
            fill: false,
            lineTension: 0,
            pointRadius: 1
          },
          {
            label: 'Evening',
            data: this.getMilkAmount('Evening'),
            borderColor: 'gray',
            fill: false,
            lineTension: 0,
            pointRadius: 0
          }
        ]
      },

      options: {
        title: {
          display: true,
          text: 'Total milk production last week'
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false
            },
            ticks: {
              maxTicksLimit: 4
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Liter'
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 4
            }
          }]
        }
      }
    });
  }


  getTop3Cows() {
    let totalProductionPerCow = [];
    from(this.milkService.allMilkRecordsList).pipe(
      groupBy(item => item.cowName),
      mergeMap(group => group.pipe(toArray()))
    )
    .forEach(x => totalProductionPerCow.push({ name: x[0].cowName, amount: x.reduce((a, b) => this.round(a + b.amount, 1), 0) }));

    let sortedProductionPerCow = totalProductionPerCow.sort((a, b) => b.amount - a.amount);
    return sortedProductionPerCow;
  }

  createBarChart() {
    let top3Cows = this.getTop3Cows();
    this.bars = new Chart(this.cowPodiumChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [top3Cows[1].name, top3Cows[0].name, top3Cows[2].name],
        datasets: [{
          label: 'Milk production podium',
          data: [top3Cows[1].amount, top3Cows[0].amount, top3Cows[2].amount],
          backgroundColor: 'rgba(38, 194, 129, 0.1)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Milk production podium'
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 4
            },
            gridLines: {
              drawOnChartArea: false
            }
          }]
        }
      }
    });
  }

  round(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
