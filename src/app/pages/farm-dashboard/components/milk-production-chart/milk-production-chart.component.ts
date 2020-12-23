import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { MilkProductionChartData } from 'src/app/common/objects/charts/milk-production/MilkProductionChartData';
import { Period, PartOfDay } from 'src/app/common/objects/Enums';

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
  @Input() inputData: MilkProductionChartData;
  
  private milkProductionLineChart: Chart;

  constructor() { }

  ngOnInit() {
    this.create(this.inputData);
  }

  public create(inputData: MilkProductionChartData){
    this.milkProductionLineChart = new Chart(this.milkProductionChart.nativeElement, {
      type: 'line',
      data: this.chartData(inputData),
      options: this.chartOptions()
    });
  }

  public update(inputData: MilkProductionChartData){
    this.milkProductionLineChart.data = this.chartData(inputData);
    this.milkProductionLineChart.options = this.chartOptions();
    this.milkProductionLineChart.update();
  }

  private chartData(inputData: MilkProductionChartData){
    return {
      labels: inputData.days,
      datasets: inputData.milkPartOfDayGroups.map(milkGroup => {
        return {
          "label": milkGroup.partOfDay,
          "data": milkGroup.milkTotals.map(x => x.totalMilk),
          "borderColor": this.getLineColor(milkGroup.partOfDay),
          "fill": false,
          "lineTension": 0,
          "pointRadius": 0
        };
      })
    };
  }

  private chartOptions(){
    return {
      title: {
        display: true,
         text: `Total milk production last ${this.period}`
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
  }

  private getLineColor(partOfDay: PartOfDay): string{
    switch (partOfDay) {
      case PartOfDay.Morning:
        return 'blue';
      case PartOfDay.Afternoon:
        return 'orange'
      case PartOfDay.Evening:
        return 'gray';
      default:
        break;
    }  
  }
}
