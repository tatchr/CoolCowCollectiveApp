import { Component, OnInit, ViewChild } from '@angular/core';
import { FarmService } from 'src/app/services/farm/farm.service';
import * as Chart from 'chart.js';
import { MilkService } from 'src/app/services/milk/milk.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { FarmDashboardDataService } from 'src/app/services/farm-dashboard-data/farm-dashboard-data.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesTypeGroup } from 'src/app/common/objects/groups/ExpensesTypeGroup';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';
import { MilkProductionChartComponent } from './components/milk-production-chart/milk-production-chart.component';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {
  @ViewChild(ExpensesChartComponent) expensesChart: ExpensesChartComponent;
  @ViewChild(MilkProductionChartComponent) milkProductionChart: MilkProductionChartComponent;

  @ViewChild('cowPodiumChart') cowPodiumChart;
  
  protected period: Period = Period.lastweek;
  protected fromDate: Date = this.datePicker.subtract(this.datePicker.today, 7, 'days');
  protected toDate: Date = this.datePicker.today;

  public expensesData: ExpensesTypeGroup[];

  protected farm: FarmDetails;
  
  constructor(public farmService: FarmService, public milkService: MilkService, private datePicker: DatepickerService,
    private dataService: FarmDashboardDataService, private expensesService: ExpensesService) { }

  ngOnInit() {    
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farm = farm;
    });

    this.expensesService.expensesLoaded.subscribe(finishedLoading => {
      if(finishedLoading){
        this.expensesData = this.dataService.getExpensesData(this.fromDate, this.toDate);
        if(this.expensesChart){
          this.expensesChart.update(this.expensesData, this.period);
        }
        this.expensesService.expensesLoaded.next(false);        
      }
    });

    // this.milkService.milkRecordsUpdated.subscribe(val => {
    //   if (val) {
    //     this.updateMilkProductionChart();
    //     this.updateCowPodiumChart();
    //     //this.createExpensesChart();
    //   }
    // });

    this.milkService.milkRecordsLoaded.subscribe(finishedLoading => {
      if (finishedLoading) {
        this.dataService.getMilkProductionData(this.fromDate, this.toDate);
        //this.createMilkProductionChart();
        //this.createCowPodiumChart();
        //this.createExpensesChart();
      }
    });
  }

  protected fromDateChanged(fromDate: Date){
    this.fromDate = fromDate;
    this.expensesService.loadExpensesList(fromDate, this.toDate);
  }

  // updateMilkProductionChart() {
  //   this.lines.config.data.datasets[0].data = this.getMilkAmount('Morning');
  //   this.lines.config.data.datasets[1].data = this.getMilkAmount('Afternoon');
  //   this.lines.config.data.datasets[2].data = this.getMilkAmount('Evening');
  //   this.lines.update();
  // }




  getTop3Cows() {
    let totalProductionPerCow = [{ name: '', amount: 0 }, { name: '', amount: 0 }, { name: '', amount: 0 }];

    from(this.milkService.allMilkRecordsList).pipe(
      groupBy(item => item.cowName),
      mergeMap(group => group.pipe(toArray()))
    )
      .subscribe(x => {
        //totalProductionPerCow.push({ name: x[0].cowName, amount: x.reduce((a, b) => this.round(a + b.amount, 1), 0) });
      });

    let sortedProductionPerCow = totalProductionPerCow.sort((a, b) => b.amount - a.amount);
    return sortedProductionPerCow;
  }

  updateCowPodiumChart() {
    let top3Cows = this.getTop3Cows();

    this.cowPodiumBarChart.config.data.labels = [top3Cows[1].name, top3Cows[0].name, top3Cows[2].name];
    this.cowPodiumBarChart.config.data.datasets[0].data = [top3Cows[1].amount, top3Cows[0].amount, top3Cows[2].amount];
    this.cowPodiumBarChart.update();
  }

  cowPodiumBarChart: Chart;
  createCowPodiumChart() {
    let top3Cows = this.getTop3Cows();
    this.cowPodiumBarChart = new Chart(this.cowPodiumChart.nativeElement, {
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


  
}
