import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesTypeGroup } from 'src/app/common/objects/groups/ExpensesTypeGroup';

@Component({
  selector: 'expenses-chart',
  templateUrl: './expenses-chart.component.html',
  styleUrls: ['./expenses-chart.component.scss'],
})
export class ExpensesChartComponent implements OnInit {
  @ViewChild('expensesChart') expensesChart;

  @Input() period: Period;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() inputData: ExpensesTypeGroup[];
  
  private expensesPieChart: Chart;

  constructor() { }

  ngOnInit() {
    this.createExpensesChart(this.inputData, this.period);
  }

  public update(inputData: ExpensesTypeGroup[], period: Period){
    this.expensesPieChart.data = this.chartData(inputData);
    this.expensesPieChart.options = this.chartOptions(period);
    this.expensesPieChart.update();
  } 

  private createExpensesChart(inputData: ExpensesTypeGroup[], period: Period) {
    this.expensesPieChart = new Chart(this.expensesChart.nativeElement, {
      type: 'doughnut',
      data: this.chartData(inputData),
      options: this.chartOptions(period)
    });
  }

  private chartData(inputData: ExpensesTypeGroup[]){
    return {
      labels: inputData.map(expense => expense.type),
      datasets: [{
        data: inputData.map(expense => expense.totalPrice),
        backgroundColor: ["red", "orange", "blue", "yellow", "green"]
      }]
    };
  }

  private chartOptions(period: Period){
    return {
      title: {
        display: true,
        text: `Total expenses ${period}`
      },
      legend: {
        display: true,
        labels: {
          boxWidth: 10
        }
      },
    };    
  }
}
