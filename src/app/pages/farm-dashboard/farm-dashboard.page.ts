import { Component, OnInit, ViewChild } from '@angular/core';
import { FarmService } from 'src/app/services/farm/farm.service';
import { MilkService } from 'src/app/services/milk/milk.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { FarmDashboardDataService } from 'src/app/services/farm-dashboard-data/farm-dashboard-data.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ExpensesTypeGroup } from 'src/app/common/objects/groups/ExpensesTypeGroup';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';
import { MilkProductionChartComponent } from './components/milk-production-chart/milk-production-chart.component';
import { MilkProductionChartData } from 'src/app/common/objects/charts/milk-production/MilkProductionChartData';
import { CowPodiumChartComponent } from './components/cow-podium-chart/cow-podium-chart.component';
import { CowChartData } from 'src/app/common/objects/charts/cows/CowChartData';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-farm-dashboard',
  templateUrl: './farm-dashboard.page.html',
  styleUrls: ['./farm-dashboard.page.scss'],
})
export class FarmDashboardPage implements OnInit {
  @ViewChild(ExpensesChartComponent) expensesChart: ExpensesChartComponent;
  @ViewChild(MilkProductionChartComponent) milkProductionChart: MilkProductionChartComponent;
  @ViewChild(CowPodiumChartComponent) cowPodiumChart: CowPodiumChartComponent;
  
  period: Period = Period.lastweek;
  fromDate: Date = this.datePicker.subtract(this.datePicker.today, 7, 'days');
  toDate: Date = this.datePicker.today;

  expensesData: ExpensesTypeGroup[];
  milkProductionChartData: MilkProductionChartData;
  cowChartData: CowChartData[];

  farm: FarmDetails;


  // static data
  herdSize: Number;
  lactatingCows: Number;
  averageMilk: Number;
  totalMilkProduced: Number;
  totalMilkSold: Number;
  totalExpenses: Number;
  
  constructor(public farmService: FarmService, public milkService: MilkService, private datePicker: DatepickerService,
    private dataService: FarmDashboardDataService, private expensesService: ExpensesService, private cowService: CowService) { }

  ngOnInit() {    
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farm = farm;
    });

    this.cowService.cowListState.subscribe(x => {
      this.herdSize = this.dataService.getHerdSize();
      this.lactatingCows = this.dataService.getLactatingCows();
    });

    this.expensesService.expensesLoaded.subscribe(finishedLoading => {
      if(finishedLoading){        
        this.totalExpenses = this.dataService.getTotalExpenses(this.fromDate, this.toDate);
        this.expensesData = this.dataService.getExpensesData(this.fromDate, this.toDate);
        if(this.expensesChart){
          this.expensesChart.update(this.expensesData, this.period);
        }
        this.expensesService.expensesLoaded.next(false);        
      }
    });

    this.milkService.milkRecordsUpdated.subscribe(val => {
      if (val) {
        this.averageMilk = this.dataService.getAverageMilk(this.fromDate, this.toDate);
        this.totalMilkProduced = this.dataService.getTotalMilkProduced(this.fromDate, this.toDate);
        this.totalMilkSold = this.dataService.getTotalMilkSold(this.fromDate, this.toDate);

        this.milkProductionChartData = this.dataService.getMilkProductionData(this.fromDate, this.toDate);
        this.cowChartData = this.dataService.getCowData(this.fromDate, this.toDate);        
        this.milkProductionChart.update(this.milkProductionChartData);
        this.cowPodiumChart.update(this.cowChartData);
      }
    });

    this.milkService.milkRecordsLoaded.subscribe(finishedLoading => {
      if (finishedLoading) {
        this.averageMilk = this.dataService.getAverageMilk(this.fromDate, this.toDate);
        this.totalMilkProduced = this.dataService.getTotalMilkProduced(this.fromDate, this.toDate);
        this.totalMilkSold = this.dataService.getTotalMilkSold(this.fromDate, this.toDate);

        this.milkProductionChartData = this.dataService.getMilkProductionData(this.fromDate, this.toDate);
        this.cowChartData = this.dataService.getCowData(this.fromDate, this.toDate);
        if(this.milkProductionChart){
          this.milkProductionChart.update(this.milkProductionChartData);
        }
        if(this.cowPodiumChart){
          this.cowPodiumChart.update(this.cowChartData);
        }
      }
    });
  }

  fromDateChanged(fromDate: Date){
    this.fromDate = fromDate;
    this.expensesService.loadExpensesList(fromDate, this.toDate);
    this.expensesService.loadRecurringExpensesList(fromDate, this.toDate);
    this.milkService.loadAllMilkRecordsList(fromDate, this.toDate);
  }  
}
