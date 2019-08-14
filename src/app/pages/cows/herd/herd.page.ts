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
  farmId:string;
  cowsList:Array<CowDetails> = [];
  filteredCowsList:Array<CowDetails> = [];

  constructor(private filterService: FilterService, private cowService: CowService, private storage: Storage) {
    this.searchControl = new FormControl();
   }

  ngOnInit() {
    this.initiate();
  }

  ionViewDidEnter(){
    this.initiate();
  }

  initiate(){
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;      
      this.cowService.getAllCows(farmId).subscribe(res => {
        this.cowsList = res['cows'];
        this.filteredCowsList = res['cows'];
      });
    });
    
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }  

  setFilteredItems(searchTerm) {
    this.filteredCowsList = this.filterService.filterItems(this.cowsList, searchTerm, ['name', 'tagNumber']);
  }

  onSearchInput(){
    this.searching = true;
  }
}
