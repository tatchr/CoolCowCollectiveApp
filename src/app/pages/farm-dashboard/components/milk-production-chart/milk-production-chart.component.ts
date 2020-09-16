import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { Period } from 'src/app/common/objects/Enums';

@Component({
  selector: 'milk-production-chart',
  templateUrl: './milk-production-chart.component.html',
  styleUrls: ['./milk-production-chart.component.scss'],
})
export class MilkProductionChartComponent implements OnInit {
  @ViewChild('milkProductionChart') milkProductionChart;

  @Input() period: Period;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() inputData;
  
  private milkProductionLineChart: Chart;

  constructor() { }

  ngOnInit() {}

  getMilkAmount(timeOfDay) {
    
  }

  createMilkProductionChart() {
    // this.milkProductionLineChart = new Chart(this.milkProductionChart.nativeElement, {
    //   type: 'line',
    //   data: {
    //     labels: this.datePicker.getDaysArray(this.fromDate, this.toDate),
    //     datasets: [
    //       {
    //         label: 'Morning',
    //         data: this.getMilkAmount('Morning'),
    //         borderColor: 'blue',
    //         fill: false,
    //         lineTension: 0,
    //         pointRadius: 0
    //       },
    //       {
    //         label: 'Afternoon',
    //         data: this.getMilkAmount('Afternoon'),
    //         borderColor: 'orange',
    //         fill: false,
    //         lineTension: 0,
    //         pointRadius: 1
    //       },
    //       {
    //         label: 'Evening',
    //         data: this.getMilkAmount('Evening'),
    //         borderColor: 'gray',
    //         fill: false,
    //         lineTension: 0,
    //         pointRadius: 0
    //       }
    //     ]
    //   },

    //   options: {
    //     title: {
    //       display: true,
    //       text: `Total milk production last ${this.period}`
    //     },
    //     legend: {
    //       display: true,
    //       labels: {
    //         boxWidth: 10
    //       }
    //     },
    //     scales: {
    //       xAxes: [{
    //         gridLines: {
    //           drawOnChartArea: false
    //         },
    //         ticks: {
    //           maxTicksLimit: 4
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Liter'
    //         },
    //         ticks: {
    //           beginAtZero: true,
    //           maxTicksLimit: 4
    //         }
    //       }]
    //     }
    //   }
    // });
  }

}
