import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CowService } from 'src/app/services/cow/cow.service';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { TimeOfDay } from 'src/app/common/objects/Enums';

@Injectable({
  providedIn: 'root'
})
export class MilkService {

  farmId: string;
  milkRecordsList: Array<MilkProductionDetails> = [];
  filteredMilkRecordsList: Array<MilkProductionDetails> = [];

  selectedDate: string = this.datePicker.formatDate(new Date());
  timeOfDay: string = TimeOfDay.Morning;

  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  totalLiters: number;

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private cowService: CowService, private storage: Storage) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadMilkRecordsList();
    });
  }
  
  loadMilkRecordsList() {
    this.getAllMilkRecords(this.farmId, this.selectedDate, this.timeOfDay).then(records => {
      this.milkRecordsList = records['milkProductionDetails'];
      this.filteredMilkRecordsList = records['milkProductionDetails'];

      if (this.filteredMilkRecordsList.length > 0) {
        this.currentlySelected = this.filteredMilkRecordsList[0];
        this.inputProduction = this.currentlySelected.amount;
      }

      this.getTotalLiters();
    });    
  }

  getTotalLiters() {
    this.totalLiters = 0;
    this.milkRecordsList.forEach(item => {
      this.totalLiters += item.amount;
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
    action();
    this.getTotalLiters();
    this.roundAmounts();
  }

  roundAmounts() {
    this.totalLiters = Math.round(this.totalLiters * 10) / 10;
    this.currentlySelected.amount = Math.round(this.currentlySelected.amount * 10) / 10;
    this.inputProduction = Math.round(this.inputProduction * 10) / 10;
  }

  getAllMilkRecords(farmId, date, timeOfDay){
    return this.httpService.get2('Loading...', environment.url + '/api/milkproduction/getAll/' + farmId + "/" + date + "/" + timeOfDay);
  }

  registerMilkRecords(records) {
    return this.httpService.post3('Saving...', environment.url + '/api/milkproduction/register', records);
  }
}
