import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CowService } from 'src/app/services/cow/cow.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { FormControl } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-herd',
  templateUrl: './herd.page.html',
  styleUrls: ['./herd.page.scss'],
})
export class HerdPage implements OnInit {

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

  constructor(private filterService: FilterService, private cowService: CowService, private storage: Storage) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.initiate();
    // this.cowService.cowListState.subscribe(mustUpdate => {
    //   if (mustUpdate) {
    //     this.loadCowsList();
    //   }
    // });
  }  

  initiate() {
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadCowsList();
    });

    this.cowService.cowListState.subscribe(mustUpdate => {
      console.log('test: ' + mustUpdate);
      if (mustUpdate) {
        console.log('test1: ' + mustUpdate);
        this.loadCowsList();
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }

  loadCowsList() {
    this.cowService.getAllCows(this.farmId).then(res => {
      this.cowsList = res['cows'];
      this.filteredCowsList = res['cows'];
      this.cowService.cowListState.next(false);
    });
  }

  setFilteredItems(searchTerm) {
    this.filtersSelected();
    this.filteredCowsList = this.filterService.filterItems(this.filteredCowsList, searchTerm, ['name', 'tagNumber']);
  }

  onSearchInput() {
    this.searching = true;
  }

  filtersSelected() {
    if (this.filters.length === 0) {
      this.filteredCowsList = this.cowsList;
    }
    else {
      this.filteredCowsList = this.filterService.filterOutItems(this.cowsList, this.filters, 'cowStatus');
    }
  }

  removeFilter(filter) {
    var index = this.filters.indexOf(filter);
    if (index > -1) {
      this.filters.splice(index, 1);
      this.filtersSelected();
    }
  }
}
