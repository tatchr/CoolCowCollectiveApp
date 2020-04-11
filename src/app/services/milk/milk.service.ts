import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CowService } from 'src/app/services/cow/cow.service';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { TimeOfDay, CowState, CowStatus, Period } from 'src/app/common/objects/Enums';
import { BehaviorSubject } from 'rxjs';
import { MilkProductionDetails } from 'src/app/common/objects/MilkProductionDetails';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MilkService {

  farmId: string;
  allMilkRecordsList: Array<MilkProductionDetails> = [];
  milkRecordsList: Array<MilkProductionDetails> = [];
  filteredMilkRecordsList: Array<MilkProductionDetails> = [];

  selectedDate: string = this.datePicker.formatDate(new Date());
  timeOfDay: string = TimeOfDay.Morning;
  fromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  toDate: string = this.datePicker.formatDate(new Date());
  selectedPeriod: string = Period.lastweek;

  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  totalLiters: number;  

  milkRecordsLoaded = new BehaviorSubject<boolean>(null);
  milkRecordsUpdated = new BehaviorSubject<Array<MilkProductionDetails>>(null);
  

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private cowService: CowService, private storage: Storage) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadAllMilkRecordsList();
    });
  }

  periodSelected(period){
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);
    
    this.toDate = result.toDate;
    this.fromDate = result.fromDate;    
    
    //this.getAllMilkRecords(this.farmId, result.fromDate, result.toDate);  
    this.loadAllMilkRecordsList();
  }
  
  loadAllMilkRecordsList(){
    this.getAllMilkRecords(this.farmId, this.fromDate, this.toDate)
    .then(records => {       
      this.allMilkRecordsList = records['milkProductionDetails']; 
    })
    .then(() => this.loadMilkRecordsList())
    .then(() => this.milkRecordsLoaded.next(true));
  }  

  loadMilkRecordsList() {
    this.getMilkRecordsOnDate(this.farmId, this.selectedDate, this.timeOfDay).then(records => {
      this.milkRecordsList = records['milkProductionDetails'];

      this.cowService.cowsList.forEach(cow => {
        if(!this.milkRecordsList.some(x => x.cowId == cow.id) && cow.cowState == CowState.InHerd && cow.cowStatus == CowStatus.Lactating){
          this.milkRecordsList.push(new MilkProductionDetails({
            id: uuidv4(),
            farmId: cow.farmId,
            cowId: cow.id,
            cowName: cow.name,
            tagNumber: cow.tagNumber,
            date: this.selectedDate,
            timeOfDay: this.timeOfDay,
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

  getMilkRecordsOnDate(farmId, date, timeOfDay){
    return this.httpService.get('Loading...', environment.url + '/api/milkproduction/get/' + farmId + '/' + date + '/' + timeOfDay);
  }

  getMilkRecordsFromDateToDate(timeOfDay, fromDate, toDate){
    return this.allMilkRecordsList.filter(x => x.timeOfDay == timeOfDay
       && this.datePicker.formatDate(x.date) >= this.datePicker.formatDate(fromDate)
       && this.datePicker.formatDate(x.date) <= this.datePicker.formatDate(toDate));
  }

  getAllMilkRecords(farmId, fromDate, toDate){
    return this.httpService.get('Loading...', environment.url + '/api/milkproduction/getAll/' + farmId + '/' + fromDate + '/' + toDate);
  }  

  registerMilkRecords(records: Array<MilkProductionDetails>) {
    return this.httpService.post3('Saving...', environment.url + '/api/milkproduction/register', records).then(() => {
      this.updateAllRecords(records);
    });
  }

  updateAllRecords(records: Array<MilkProductionDetails>){
    records.forEach(record => {
      record.hasBeenUpdated = false;
      let index = this.allMilkRecordsList.map(x => x.id).indexOf(record.id);      
      if(index > 0){
        this.allMilkRecordsList[index] = record;
      }
      else{
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
