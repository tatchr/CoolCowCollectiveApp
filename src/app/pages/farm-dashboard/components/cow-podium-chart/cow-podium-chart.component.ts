import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { CowChartData } from 'src/app/common/objects/charts/cows/CowChartData';
import { Period } from 'src/app/common/objects/Enums';

@Component({
  selector: 'cow-podium-chart',
  templateUrl: './cow-podium-chart.component.html',
  styleUrls: ['./cow-podium-chart.component.scss'],
})
export class CowPodiumChartComponent implements OnInit {
  @ViewChild('cowPodiumChart') cowPodiumChart;

  @Input() period: Period;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() inputData: CowChartData[];

  constructor() { }

  ngOnInit() {
    this.create(this.inputData);
  }

  private cowPodiumBarChart: Chart;

  public create(inputData: CowChartData[]){
    this.cowPodiumBarChart = new Chart(this.cowPodiumChart.nativeElement, {
      type: 'bar',
      data: this.chartData(inputData),
      options: this.chartOptions()
    });
  }

  public update(inputData: CowChartData[]){
    this.cowPodiumBarChart.data = this.chartData(inputData);
    this.cowPodiumBarChart.update();
  }

  private chartData(inputData: CowChartData[]){
    return {
      labels: inputData.map(cowData => cowData.name),
      datasets: [{
        label: 'Milk production podium',
        data: inputData.map(cowData => cowData.totalMilk),
        backgroundColor: 'rgba(38, 194, 129, 0.1)',
        borderColor: 'rgb(38, 194, 129)',
        borderWidth: 1
      }]
    }
  }

  private chartOptions(){
    return {
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
    };
  }
}
