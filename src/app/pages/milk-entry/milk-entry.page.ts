import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
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

  fromDate = new Date('2016-01-01');
  toDate = new Date('2025-12-31');
  selectedDateString: string = this.datePicker.formatDate(new Date());
  timeOfDay: string = "Morning";
  inputProduction: number = 0.00;
  currentlySelected: MilkProductionDetails = null;
  selectedIndex: number = -1;
  showInputPanel: boolean = false;
  totalLiters: number;

  scrollTo = null;

  constructor(private filterService: FilterService, private milkService: MilkService, private cowService: CowService,
    private datePicker: DatepickerService, private storage: Storage, public keyboard: Keyboard) {
    this.searchControl = new FormControl();
  }
  @ViewChild(IonList, { read: ElementRef }) list: ElementRef;

  ngOnInit() {
    this.cowService.cowListState.subscribe(mustUpdate => {
      if (mustUpdate) {
        this.loadMilkRecordsList();
      }
    });

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
    this.milkService.getAllMilkRecords(this.farmId, this.selectedDateString, this.timeOfDay).then(records => {
      this.milkRecordsList = records['milkProductionDetails'];
      this.filteredMilkRecordsList = records['milkProductionDetails'];
      if (this.filteredMilkRecordsList.length > 0) {
        this.currentlySelected = this.filteredMilkRecordsList[0];
        this.inputProduction = this.currentlySelected.amount;
      }

      this.getTotalLiters();
    });    
  }

  submit() {
    if (this.filteredMilkRecordsList.length <= 0) {
      return;
    }

    for (var i in this.filteredMilkRecordsList) {
      this.filteredMilkRecordsList[i].timeOfDay = this.timeOfDay;
    }

    this.milkService.registerMilkRecords(this.filteredMilkRecordsList);
  }  

  inputProductionSubmitted() {
    if (this.inputProduction == null) {
      this.currentlySelected.amount = 0.0;
      this.inputProduction = 0.0;
    }
    else {
      this.currentlySelected.amount = this.inputProduction;
    }

    this.toNextCow();
  }

  cowSelected(item, index) {
    this.currentlySelected = item;
    this.inputProduction = item.amount;
    this.showInputPanel = true;
    this.selectedIndex = index;

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[index];

    selectedItem.scrollIntoView({ behavior: 'auto', block: 'center' });
    this.getTotalLiters();
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
    this.getTotalLiters();
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
    this.getTotalLiters();
  }

  timeOfDaySelected(newTimeOfDay) {
    this.timeOfDay = newTimeOfDay;
    this.loadMilkRecordsList();
  }

  async openDatePicker() {
    this.selectedDateString = await this.datePicker.openDatePicker(this.fromDate, this.toDate, this.selectedDateString);
    this.loadMilkRecordsList();
  }

  closeInputPanel() {
    this.showInputPanel = false;
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

  onSearchInput() {
    this.searching = true;
  }

  inputProductionClicked() {
    this.inputProduction = null;
  }  

  getTotalLiters() {
    this.totalLiters = 0;
    this.milkRecordsList.forEach(item => {
      this.totalLiters += item.amount;
    });
  }

  roundAmounts() {
    this.totalLiters = Math.round(this.totalLiters * 10) / 10;
    this.currentlySelected.amount = Math.round(this.currentlySelected.amount * 10) / 10;
    this.inputProduction = Math.round(this.inputProduction * 10) / 10;
  }
}
