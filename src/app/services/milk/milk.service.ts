import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CowService } from 'src/app/services/cow/cow.service';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { PartOfDay, CowState, CowStatus, Period } from 'src/app/common/objects/Enums';
import { BehaviorSubject } from 'rxjs';
import { MilkProductionDetails } from 'src/app/common/objects/MilkProductionDetails';
import { v4 as uuidv4 } from 'uuid';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';

@Injectable({
  providedIn: 'root'
})
export class MilkService {

  farmId: string;
  allMilkRecordsList: Array<MilkProductionDetails> = [];
  milkRecordsList: Array<MilkProductionDetails> = [];
  filteredMilkRecordsList: Array<MilkProductionDetails> = [];

  selectedDate: Date = this.datePicker.today;
  partOfDay: string = PartOfDay.Morning;
  fromDate: Date = this.datePicker.subtract(new Date(), 7, 'days');
  toDate: Date = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  totalLiters: number;

  milkRecordsLoaded = new BehaviorSubject<boolean>(null);
  public milkRecordsUpdated = new BehaviorSubject<boolean>(null);


  constructor(private httpService: HttpService, public datePicker: DatepickerService,
    private cowService: CowService, private farmService: FarmService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id;
      //this.loadAllMilkRecordsList(this.fromDate, this.toDate);
    });
  }

  periodSelected(period) {
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);

    this.toDate = result.toDate;
    this.fromDate = result.fromDate;

    this.loadAllMilkRecordsList(this.fromDate, this.toDate);
  }

  loadAllMilkRecordsList(fromDate, toDate) {
    this.getAllMilkRecords(this.farmId, fromDate, toDate)
      .then(records => {
        this.allMilkRecordsList = records['milkProductionDetails'];
      })
      .then(() => this.loadMilkRecordsList())
      .then(() => this.milkRecordsLoaded.next(true));
  }

  getAllMilkRecords(farmId, fromDate, toDate) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);

    return this.farmService.getFarm().then((farm: FarmDetails) => {
      console.log('farmmmm');
      console.log(farm);
      return this.httpService.get(
        'Loading...', 
        `${environment.url}/farms/${farm.id}/milk-production-records?from_date=${from}&to_date=${to}`);
    });
  }

  loadMilkRecordsList() {
    this.getMilkRecordsOnDate(this.farmId, this.selectedDate, this.partOfDay).then(records => {
      this.milkRecordsList = records['milkProductionDetails'];

      this.cowService.cowsList.forEach(cow => {
        if (!this.milkRecordsList.some(x => x.cowId == cow.id) && cow.cowState == CowState.InHerd && cow.cowStatus == CowStatus.Lactating) {
          this.milkRecordsList.push(new MilkProductionDetails({
            id: uuidv4(),
            farmId: cow.farmId,
            cowId: cow.id,
            cowName: cow.name,
            tagNumber: cow.tagNumber,
            date: this.selectedDate,
            partOfDay: this.partOfDay,
            amount: 0.0
          }));
        }
      });

      this.filteredMilkRecordsList = this.milkRecordsList;
      this.getTotalLiters();

      if (this.filteredMilkRecordsList.length > 0) {
        this.currentlySelected = this.filteredMilkRecordsList[0];
        this.inputProduction = this.currentlySelected.amount;
      }
    });
  }

  getMilkRecordsOnDate(farmId, date, partOfDay) {
    let selectedDate = this.datePicker.formatDate(date);
    return this.httpService.get('Loading...', `${environment.url}/farms/${farmId}/milk-production-records?from_date=${selectedDate}&to_date=${selectedDate}&part_of_day=${partOfDay}`);
  }

  getMilkRecordsFromDateToDate(partOfDay, fromDate, toDate) {
    return this.allMilkRecordsList.filter(x => x.partOfDay == partOfDay
      && this.datePicker.formatDate(x.date) >= this.datePicker.formatDate(fromDate)
      && this.datePicker.formatDate(x.date) <= this.datePicker.formatDate(toDate));
  }



  registerMilkRecords(records: Array<MilkProductionDetails>) {
    return this.httpService.post3('Saving...', `${environment.url}/farms/${this.farmId}/milk-production-records`, records)
      .then(() => {
        this.updateAllRecords(records);
      })
      .then(() => {
        this.milkRecordsUpdated.next(true);
      });
  }

  delete(cowId: string){
    return this.httpService.delete(`${environment.url}/farms/${this.farmId}/cows/${cowId}/milk-production-records`);
  }

  updateAllRecords(records: Array<MilkProductionDetails>) {
    records.forEach(record => {
      record.hasBeenUpdated = false;
      let index = this.allMilkRecordsList.map(x => x.id).indexOf(record.id);
      if (index >= 0) {
        this.allMilkRecordsList[index] = record;
      }
      else {
        this.allMilkRecordsList.push(record);
      }
    });
  }

  subtractOne() {
    if (this.inputProduction >= 1) {
      let action = () => {
        this.currentlySelected.amount -= 1;
        this.inputProduction -= 1;
      }
      this.changeAmount(action);
    }
  }

  subtractOneDecimal() {
    if (this.inputProduction >= 0.1) {
      let action = () => {
        this.currentlySelected.amount -= 0.1;
        this.inputProduction -= 0.1;
      }
      this.changeAmount(action);
    }
  }

  addOne() {
    let action = () => {
      this.currentlySelected.amount += 1;
      this.inputProduction += 1;
    }
    this.changeAmount(action);
  }

  addOneDecimal() {
    let action = () => {
      this.currentlySelected.amount += 0.1;
      this.inputProduction += 0.1;
    }
    this.changeAmount(action);
  }

  changeAmount(action) {
    this.currentlySelected.amount = this.inputProduction;
    this.currentlySelected.hasBeenUpdated = true;
    action();
    this.getTotalLiters();
  }

  getTotalLiters() {
    this.totalLiters = this.milkRecordsList.reduce((a, b) => a + b.amount, 0);
  }
}
