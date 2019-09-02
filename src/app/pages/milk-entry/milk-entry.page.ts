import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import * as moment from 'moment';
import { FilterService } from 'src/app/services/filter/filter.service';
import { MilkService } from 'src/app/services/milk/milk.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { IonContent, IonList } from '@ionic/angular';

@Component({
  selector: 'app-milk-entry',
  templateUrl: './milk-entry.page.html',
  styleUrls: ['./milk-entry.page.scss'],
})

export class MilkEntryPage implements OnInit {

  farmId: string;
  milkRecordsList: Array<MilkProductionDetails> = [];
  searchTerm: String = "";
  datePickerObj: any;
  selectedDateString: String = this.formatDate(new Date());
  timeOfDay: string = "Morning";
  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  selectedIndex: number = -1;
  showInputPanel: boolean = false;

  scrollTo = null;

  constructor(private milkService: MilkService, private cowService: CowService, private datePicker: DatepickerService, private storage: Storage) { }
  @ViewChild(IonList, { read: ElementRef }) list: ElementRef;

  ngOnInit() {
    let fromDate = new Date('2016-01-01');
    let toDate = new Date('2025-12-31');
    this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);

    this.initiate();
  }

  ionViewDidEnter() {
    this.cowService.cowListState.subscribe(mustUpdate => {
      if (mustUpdate) {
        this.loadMilkRecordsList();
      }
    });
  }

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadMilkRecordsList();
    });
  }

  loadMilkRecordsList() {
    this.milkService.getAllMilkRecords(this.farmId, this.selectedDateString, this.timeOfDay).subscribe(res => {
      this.milkRecordsList = res['milkProductionDetails'];
      if (this.milkRecordsList.length > 0) {
        this.currentlySelected = this.milkRecordsList[0];
      }
    });
  }

  submit() {
    for (var i in this.milkRecordsList) {
      this.milkRecordsList[i].timeOfDay = this.timeOfDay;
    }

    this.milkService.registerMilkRecords(this.milkRecordsList).subscribe(res => {
      this.loadMilkRecordsList();
    });
  }

  cowSelected(item, index) {
    this.currentlySelected = item;
    this.inputProduction = item.amount;
    this.showInputPanel = true;
    this.selectedIndex = index;

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[index];

    selectedItem.scrollIntoView();
  }

  toNextCow() {
    this.selectedIndex += 1;
    if (this.selectedIndex >= this.milkRecordsList.length) {
      this.selectedIndex = 0;
    }

    this.currentlySelected = this.milkRecordsList[this.selectedIndex];
    this.currentlySelected.amount = this.inputProduction;

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[this.selectedIndex];
    selectedItem.scrollIntoView();
  }

  toPreviousCow() {
    this.selectedIndex -= 1;
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.milkRecordsList.length != 0 ? this.milkRecordsList.length - 1 : 0;
    }

    this.currentlySelected = this.milkRecordsList[this.selectedIndex];
    this.currentlySelected.amount = this.inputProduction;

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[this.selectedIndex];
    selectedItem.scrollIntoView();
  }


  timeOfDaySelected(newTimeOfDay) {
    this.timeOfDay = newTimeOfDay;
    this.loadMilkRecordsList();
  }

  async openDatePicker() {
    this.datePickerObj.inputDate = this.selectedDateString;
    const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);

    await datePickerModal.present();
    datePickerModal.onDidDismiss().then((data) => {
      if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
        this.selectedDateString = this.formatDate(data.data.date);
        this.loadMilkRecordsList();
      }
    });
  }

  formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  closeInputPanel() {
    this.showInputPanel = false;
  }

  setFilteredItems() {
    //this.filteredCowsList = this.filterService.filterItems(this.cowsList, this.searchTerm, ['name', 'tagNumber']);
  }

  subtractOne() {
    if (this.inputProduction >= 1) {
      this.currentlySelected.amount -= 1;
      this.inputProduction -= 1;
    }
  }

  subtractOneDecimal() {
    console.log(this.inputProduction);
    if (this.inputProduction >= 0.1) {
      this.currentlySelected.amount -= 0.1;
      this.inputProduction -= 0.1;
    }
  }

  addOne() {
    this.currentlySelected.amount += 1;
    this.inputProduction += 1;
  }

  addOneDecimal() {
    this.currentlySelected.amount += 0.1;
    this.inputProduction += 0.1;
  }

  inputProductionChanged(input) {
    console.log(input.target.value);
    let val = input.target.value;
    this.currentlySelected.amount = val;
    this.inputProduction = val;
  }
}
