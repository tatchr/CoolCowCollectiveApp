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

  selectedIndex: number = -1;
  showInputPanel: boolean = false;
  scrollTo: number = null;

  constructor(private filterService: FilterService, public milkService: MilkService, private cowService: CowService,
    private datePicker: DatepickerService, private storage: Storage, public keyboard: Keyboard) {
    this.searchControl = new FormControl();
  }
  @ViewChild(IonList, { read: ElementRef }) list: ElementRef;

  ngOnInit() {
    this.cowService.cowListState.subscribe(mustUpdate => {
      if (mustUpdate) {
        this.milkService.loadMilkRecordsList();
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }

  setFilteredItems(searchTerm) {
    this.milkService.filteredMilkRecordsList = this.filterService.doSearch(this.milkService.milkRecordsList, searchTerm, ['cowName', 'tagNumber']);
  }

  submit() {
    if (this.milkService.filteredMilkRecordsList.length <= 0) {
      return;
    }

    for (var i in this.milkService.filteredMilkRecordsList) {
      this.milkService.filteredMilkRecordsList[i].timeOfDay = this.milkService.timeOfDay;
    }

    this.milkService.registerMilkRecords(this.milkService.filteredMilkRecordsList);
  }  

  inputProductionSubmitted() {
    if (this.milkService.inputProduction == null) {
      this.milkService.currentlySelected.amount = 0.0;
      this.milkService.inputProduction = 0.0;
    }
    else {
      this.milkService.currentlySelected.amount = this.milkService.inputProduction;
    }

    this.toNextCow();
  }

  cowSelected(item, index) {
    this.milkService.currentlySelected = item;
    this.milkService.inputProduction = item.amount;
    this.showInputPanel = true;
    this.selectedIndex = index;

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[index];

    selectedItem.scrollIntoView({ behavior: 'auto', block: 'center' });
    this.milkService.getTotalLiters();
  }

  toNextCow() {
    this.selectedIndex += 1;
    if (this.selectedIndex >= this.milkService.filteredMilkRecordsList.length) {
      this.selectedIndex = 0;
    }

    this.milkService.currentlySelected.amount = this.milkService.inputProduction;
    this.milkService.currentlySelected = this.milkService.filteredMilkRecordsList[this.selectedIndex];

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[this.selectedIndex];
    selectedItem.scrollIntoView();
    this.milkService.getTotalLiters();
  }

  toPreviousCow() {
    this.selectedIndex -= 1;
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.milkService.filteredMilkRecordsList.length != 0
        ? this.milkService.filteredMilkRecordsList.length - 1
        : 0;
    }

    this.milkService.currentlySelected.amount = this.milkService.inputProduction;
    this.milkService.currentlySelected = this.milkService.filteredMilkRecordsList[this.selectedIndex];

    let arr = this.list.nativeElement.children;
    let selectedItem = arr[this.selectedIndex];
    selectedItem.scrollIntoView();
    this.milkService.getTotalLiters();
  }

  timeOfDaySelected(newTimeOfDay) {
    this.milkService.timeOfDay = newTimeOfDay;
    this.milkService.loadMilkRecordsList();
  }

  async openDatePicker() {
    this.milkService.selectedDate = await this.datePicker.openDatePicker(this.milkService.selectedDate);
    this.milkService.loadMilkRecordsList();
  }

  closeInputPanel() {
    this.showInputPanel = false;
  }

  onSearchInput() {
    this.searching = true;
  }

  inputProductionClicked() {
    this.milkService.inputProduction = null;
  }
}
