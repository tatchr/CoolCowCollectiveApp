import { Component, OnInit } from '@angular/core';
import { CowService } from 'src/app/services/cow/cow.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { FormControl } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';
import { CowStatus } from 'src/app/common/objects/Enums';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { CowDetails } from 'src/app/common/objects/CowDetails';

@Component({
  selector: 'app-herd',
  templateUrl: './herd.page.html',
  styleUrls: ['./herd.page.scss']
})
export class HerdPage implements OnInit {

  searchControl: FormControl;
  searching: Boolean = false;
  filters: Array<string> = [];

  cowStatuses: Array<CowStatus> = [CowStatus.Lactating, CowStatus.NonLactating, CowStatus.NA];

  constructor(private router: Router, private filterService: FilterService, public cowService: CowService, private farmService: FarmService) {
    this.searchControl = new FormControl();
  }  

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(searchTerm => {
        this.searching = false;
        this.doSearch(searchTerm);
      });
  }

  openNewCowRecord(){
    this.farmService.getFarm().then((farm: FarmDetails) => {
      let navigationExtras: NavigationExtras = {
        state: {
          cowDetails: new CowDetails({
            farmId: farm.id
          })
        }
      };

      this.router.navigate(['cow-input'], navigationExtras);
    });
  }

  openCowRecord(cow) {
    let navigationExtras: NavigationExtras = {
      state: {
        cowDetails: cow
      }
    };
    this.router.navigate(['cow-edit'], navigationExtras);
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
      //this.cowService.filteredCowsList = this.cowService.cowsList;
    }
    else {
      //this.cowService.filteredCowsList = this.filterService.applyFilters(this.cowService.cowsList, this.filters, 'cowStatus');
    }
  }
}
