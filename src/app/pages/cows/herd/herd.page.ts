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
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { CowState, CowStatus } from 'src/app/common/objects/Enums';

@Component({
  selector: 'app-herd',
  templateUrl: './herd.page.html',
  styleUrls: ['./herd.page.scss'],
  providers: [Keyboard]
})
export class HerdPage extends CowBaseComponent implements OnInit {

  searchControl: FormControl;
  searching: Boolean = false;
  filters: Array<string> = [];

  cowStatuses: Array<CowStatus> = [CowStatus.Lactating, CowStatus.NonLactating, CowStatus.NA];

  constructor(router: Router, formBuilder: FormBuilder, private filterService: FilterService,
    storage: Storage, cowService: CowService, datePicker: DatepickerService, keyboard: Keyboard) {
    super(router, formBuilder, storage, cowService, datePicker, keyboard);
    this.searchControl = new FormControl();
  }  

  ngOnInit() {  
    this.cowService.cowRegistered.subscribe(newCow => {
      if (newCow) {
        this.cowService.cowsList.push(newCow);
        this.applyFiltersAndSort();
        this.cowService.cowListState.next(true);
      }
    });

    this.cowService.cowDeleted.subscribe(cowId => {
      if (cowId) {
        let cowToDelete = this.cowService.cowsList.map(x => x.id).findIndex(x => x == cowId);
        this.cowService.cowsList.splice(cowToDelete, 1);
        this.applyFiltersAndSort();
        this.cowService.cowListState.next(true);
      }
    });

    this.cowService.cowUpdated.subscribe(cow => {
      if (cow) {
        let cowToUpdate = this.cowService.cowsList.map(x => x.id).findIndex(x => x == cow.id);
        this.cowService.cowsList[cowToUpdate] = cow;
        this.applyFiltersAndSort();
        this.cowService.cowListState.next(true);
      }
    });

    this.cowService.cowSold.subscribe(cowId => {
      if (cowId) {
        let index = this.cowService.cowsList.map(x => x.id).findIndex(x => x == cowId);
        this.cowService.cowsList[index].cowState = CowState.Sold;
        this.applyFiltersAndSort();
        this.cowService.cowListState.next(true);
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(searchTerm => {
        this.searching = false;
        this.doSearch(searchTerm);
      });
  }

  openCowPassport(cowId) {
    let index = this.cowService.cowsList.map(x => x.id).findIndex(x => x == cowId);
    let navigationExtras: NavigationExtras = {
      state: {
        cowDetails: this.cowService.cowsList[index]
      }
    };
    this.router.navigate(['cow-passport'], navigationExtras);
  }

  applyFiltersAndSort() {
    this.applyFilters();

    this.cowService.filteredCowsList.sort((a, b) => {
      return a.cowState.localeCompare('InHerd')        
    });

    if (this.searchControl.value) {
      this.searchControl.setValue(this.searchControl.value);
    }
  }

  doSearch(searchTerm) {
    this.applyFilters();
    this.cowService.filteredCowsList = this.filterService.doSearch(this.cowService.filteredCowsList, searchTerm, ['name', 'tagNumber']);
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
      this.cowService.filteredCowsList = this.cowService.cowsList;
    }
    else {
      this.cowService.filteredCowsList = this.filterService.applyFilters(this.cowService.cowsList, this.filters, 'cowStatus');
    }
  }
}
