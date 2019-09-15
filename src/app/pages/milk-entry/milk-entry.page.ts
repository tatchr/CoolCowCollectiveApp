import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import * as moment from 'moment';
import { FilterService } from 'src/app/services/filter/filter.service';
import { MilkService } from 'src/app/services/milk/milk.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { IonList } from '@ionic/angular';
import { FormControl } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-milk-entry',
  templateUrl: './milk-entry.page.html',
  styleUrls: ['./milk-entry.page.scss'],
  providers: [Keyboard]
})

export class MilkEntryPage implements OnInit {

  searchControl: FormControl;
  searching: Boolean = false;

  farmId: string;
  milkRecordsList: Array<MilkProductionDetails> = [];
  filteredMilkRecordsList: Array<MilkProductionDetails> = [];

  datePickerObj: any;
  selectedDateString: string = this.formatDate(new Date());
  timeOfDay: string = "Morning";
  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  selectedIndex: number = -1;
  showInputPanel: boolean = false;

  scrollTo = null;

  constructor(private filterService: FilterService, private milkService: MilkService, private cowService: CowService, 
    private datePicker: DatepickerService, private storage: Storage, public keyboard: Keyboard) {
    this.searchControl = new FormControl();
  }
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

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }

  setFilteredItems(searchTerm) {
    this.filteredMilkRecordsList = this.filterService.filterItems(this.milkRecordsList, searchTerm, ['cowName', 'tagNumber']);
  }

  loadMilkRecordsList() {
    this.milkService.getAllMilkRecords(this.farmId, this.selectedDateString, this.timeOfDay).subscribe(res => {
      this.milkRecordsList = res['milkProductionDetails'];
      this.filteredMilkRecordsList = res['milkProductionDetails'];
      if (this.filteredMilkRecordsList.length > 0) {
        this.currentlySelected = this.filteredMilkRecordsList[0];
        this.inputProduction = this.currentlySelected.amount;
      }
    });
  }

  submit() {
    if (this.filteredMilkRecordsList.length <= 0) {
      return;
    }

    for (var i in this.filteredMilkRecordsList) {
      this.filteredMilkRecordsList[i].timeOfDay = this.timeOfDay;
    }

    this.milkService.registerMilkRecords(this.filteredMilkRecordsList).subscribe(res => {
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

    selectedItem.scrollIntoView({ behavior: 'auto', block: 'center' });
  }

  toNextCow() {
    this.selectedIndex += 1;
    if (this.selectedIndex >= this.filteredMilkRecordsList.length) {
      this.selectedIndex = 0;
    }

    this.currentlySelected.amount = this.inputProduction;
    this.currentlySelected = this.filteredMilkRecordsList[this.selectedIndex];

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[this.selectedIndex];
    selectedItem.scrollIntoView();
  }

  toPreviousCow() {
    this.selectedIndex -= 1;
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.filteredMilkRecordsList.length != 0
        ? this.filteredMilkRecordsList.length - 1
        : 0;
    }

    this.currentlySelected.amount = this.inputProduction;
    this.currentlySelected = this.filteredMilkRecordsList[this.selectedIndex];
    

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

  subtractOne() {
    if (this.inputProduction >= 1) {
      this.currentlySelected.amount = this.inputProduction;
      this.currentlySelected.amount -= 1;
      this.inputProduction -= 1;
      this.roundAmounts();
    }
  }

  subtractOneDecimal() {
    console.log(this.inputProduction);
    if (this.inputProduction >= 0.1) {
      this.currentlySelected.amount = this.inputProduction;
      this.currentlySelected.amount -= 0.1;
      this.inputProduction -= 0.1;
      this.roundAmounts();
    }
  }

  addOne() {
    this.currentlySelected.amount = this.inputProduction;
    this.currentlySelected.amount += 1;
    this.inputProduction += 1;
    this.roundAmounts();
  }

  addOneDecimal() {
    this.currentlySelected.amount = this.inputProduction;
    this.currentlySelected.amount += 0.1;
    this.inputProduction += 0.1;
    this.roundAmounts();
  }

  roundAmounts(){
    this.currentlySelected.amount = Math.round(this.currentlySelected.amount * 10) / 10;
    this.inputProduction = Math.round(this.inputProduction * 10) / 10;
  }

  onSearchInput() {
    this.searching = true;
  }

  inputProductionClicked(){
    this.inputProduction = null;
  }

  inputProductionSubmitted(){
    if(this.inputProduction == null){
      this.currentlySelected.amount = 0.0;
      this.inputProduction = 0.0;
    }
    else{
      this.currentlySelected.amount = this.inputProduction;
    }
    
    this.toNextCow();
  }
 
}
