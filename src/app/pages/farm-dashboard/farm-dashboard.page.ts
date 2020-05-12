import { Component, OnInit, ViewChild } from '@angular/core';
import { FarmService } from 'src/app/services/farm/farm.service';
import * as Chart from 'chart.js';
import { MilkService } from 'src/app/services/milk/milk.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {
  @ViewChild('cowPodiumChart') cowPodiumChart;
  @ViewChild('expensesChart') expensesChart;

  colorArray: any;

  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());

  constructor(public farmService: FarmService, public milkService: MilkService, private datePicker: DatepickerService) { }

  ngOnInit() {
    this.initiate();
  }

  initiate() {
    this.milkService.milkRecordsUpdated.subscribe(val => {
      if (val) {
        this.updateMilkProductionChart();
        this.updateCowPodiumChart();
        //this.createExpensesChart();
      }
    });

    this.milkService.milkRecordsLoaded.subscribe(finishedLoading => {
      if (finishedLoading) {
        this.createMilkProductionChart();
        this.createCowPodiumChart();
        this.createExpensesChart();
      }
    });
  }

  updateMilkProductionChart() {
    this.lines.config.data.datasets[0].data = this.getMilkAmount('Morning');
    this.lines.config.data.datasets[1].data = this.getMilkAmount('Afternoon');
    this.lines.config.data.datasets[2].data = this.getMilkAmount('Evening');
    this.lines.update();
  }

  getMilkAmount(timeOfDay) {
    let milkRecords = this.milkService.allMilkRecordsList.filter(x => x.timeOfDay == timeOfDay);
    let days: String[] = this.datePicker.getDaysArray(this.milkService.fromDate, this.milkService.toDate);

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
        labels: this.datePicker.getDaysArray(this.milkService.fromDate, this.milkService.toDate),
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
          text: 'Total milk production last ' + this.milkService.datePicker.periods.find(x => x.value == this.milkService.selectedPeriod).label
        },
        legend: {
          display: true,
          labels: {
            boxWidth: 10
          }
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
    let totalProductionPerCow = [{ name: '', amount: 0 }, { name: '', amount: 0 }, { name: '', amount: 0 }];

    from(this.milkService.allMilkRecordsList).pipe(
      groupBy(item => item.cowName),
      mergeMap(group => group.pipe(toArray()))
    )
      .subscribe(x => {
        totalProductionPerCow.push({ name: x[0].cowName, amount: x.reduce((a, b) => this.round(a + b.amount, 1), 0) });
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

  expensesPieChart: Chart;
  createExpensesChart() {
    this.expensesPieChart = new Chart(this.expensesChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Medicine', 'Feed', 'Labor', 'Other'],
        datasets: [{
          data: [10, 20, 30, 40],
          backgroundColor: [
            "red",
            "orange",
            "blue",
            "green"
          ]
        }]
      },
      options: {
        title: {
          display: true,
          text: `Total expenses last ${this.milkService.datePicker.periods.find(x => x.value == this.milkService.selectedPeriod).label}`
        },
        legend: {
          display: true,
          labels: {
            boxWidth: 10
          }
        },
      }
    });
  }


  round(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
