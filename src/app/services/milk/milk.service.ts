import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CowService } from 'src/app/services/cow/cow.service';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { PartOfDay, CowState, CowStatus, Period } from 'src/app/common/objects/Enums';
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

  selectedDate: string = this.datePicker.today;
  partOfDay: string = PartOfDay.Morning;
  selectedPeriod: string = Period.lastweek;

  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  totalLiters: number;

  constructor(private httpService: HttpService, public datePicker: DatepickerService,
    private cowService: CowService, private farmService: FarmService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id;
    });
  }

  loadMilkRecords(fromDate, toDate){
    var promise = new Promise<void>((resolve) => {
      this.getAllMilkRecords(fromDate, toDate).then(response => {
        this.allMilkRecordsList = response['milkProductionDetails'];
        resolve();
      });
    });

    return promise;
  }

  getAllMilkRecords(fromDate, toDate) {
    return this.httpService.get(
      'Loading...', 
      `${environment.url}/farms/${this.farmId}/milk-production-records?from_date=${fromDate}&to_date=${toDate}`);
  }

  loadMilkRecordsList() {
    this.getMilkRecordsOnDate(this.farmId, this.selectedDate, this.partOfDay).then(response => {
      this.milkRecordsList = response['milkProductionDetails'];

      this.cowService.cows$.subscribe(cows => {
        cows.forEach(cow => {
          if(!this.milkRecordsList.some(x => x.cowId == cow.id) && cow.cowState == CowState.InHerd && cow.cowStatus == CowStatus.Lactating){
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
