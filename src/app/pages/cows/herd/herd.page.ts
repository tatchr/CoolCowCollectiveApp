import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormBuilder } from '@angular/forms';
import { CowService } from 'src/app/services/cow/cow.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { FormControl } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Router, NavigationExtras } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { CowBaseComponent } from 'src/app/pages/cows/cow-base/cow-base.component';

@Component({
  selector: 'app-herd',
  templateUrl: './herd.page.html',
  styleUrls: ['./herd.page.scss'],
  providers: [Keyboard]
})
export class HerdPage extends CowBaseComponent implements OnInit {

  searchControl: FormControl;
  searching: Boolean = false;
  farmId: string;
  cowsList: Array<CowDetails> = [];
  filteredCowsList: Array<CowDetails> = [];
  filters: Array<string> = [];

  cowStatuses: Array<CowStatus> = [
    { value: 'Lactating', name: 'Lactating' },
    { value: 'Non-Lactating', name: 'Non-Lactating' },
    { value: 'N/A', name: 'N/A' }
  ];

  constructor(router: Router, formBuilder: FormBuilder, private filterService: FilterService,
    storage: Storage, cowService: CowService, datePicker: DatepickerService, keyboard: Keyboard) {
    super(router, formBuilder, storage, cowService, datePicker, keyboard);
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.initiate();
  }

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadCowsList();
    });

    this.cowService.cowRegistered.subscribe(newCow => {
      if (newCow) {
        this.cowsList.push(newCow);
        this.applyFiltersAndSort();
      }
    });

    this.cowService.cowDeleted.subscribe(cowId => {
      if (cowId) {
        let cowToDelete = this.cowsList.map(x => x.id).findIndex(x => x == cowId);
        this.cowsList.splice(cowToDelete, 1);
        this.applyFiltersAndSort();
      }
    });

    this.cowService.cowUpdated.subscribe(cow => {
      if (cow) {
        let cowToUpdate = this.cowsList.map(x => x.id).findIndex(x => x == cow.id);
        this.cowsList[cowToUpdate] = cow;
        this.applyFiltersAndSort();
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(searchTerm => {
        this.searching = false;
        this.doSearch(searchTerm);
      });
  }

  loadCowsList() {
    this.cowService.getAllCows(this.farmId).then(res => {
      this.cowsList = res['cows'];
      this.filteredCowsList = this.cowsList;
      this.cowService.cowListState.next(false);
    });
  }

  openCowPassport(cowId) {
    let index = this.cowsList.map(x => x.id).findIndex(x => x == cowId);
    let navigationExtras: NavigationExtras = {
      state: {
        cowList: this.cowsList,
        cowDetails: this.cowsList[index]
      }
    };
    this.router.navigate(['cow-passport'], navigationExtras);
  }

  applyFiltersAndSort() {
    this.applyFilters();

    this.filteredCowsList.sort((a, b) => {
      return a.cowState.localeCompare('InHerd')
        
    });

    if (this.searchControl.value) {
      this.searchControl.setValue(this.searchControl.value);
    }
  }

  doSearch(searchTerm) {
    this.applyFilters();
    this.filteredCowsList = this.filterService.doSearch(this.filteredCowsList, searchTerm, ['name', 'tagNumber']);
  }

  onSearchInput() {
    this.searching = true;
  }

  removeFilter(filter) {
    var index = this.filters.indexOf(filter);
    if (index > -1) {
      this.filters.splice(index, 1);
      this.applyFilters();
    }
  }

  applyFilters() {
    if (this.filters.length === 0) {
      this.filteredCowsList = this.cowsList;
    }
    else {
      this.filteredCowsList = this.filterService.applyFilters(this.cowsList, this.filters, 'cowStatus');
    }
  }
}
