import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { Animal, CowState } from 'src/app/common/objects/Enums';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { FilterService } from 'src/app/services/filter/filter.service';

@Injectable({
  providedIn: 'root'
})
export class CowService {
  
  cowListState = new BehaviorSubject(null);
  cowRegistered = new BehaviorSubject<CowDetails>(null);
  cowUpdated = new BehaviorSubject<CowDetails>(null);
  cowDeleted = new BehaviorSubject<string>(null);
  cowSold = new BehaviorSubject<string>(null);

  cowsList: Array<CowDetails> = [];
  filteredCowsList: Array<CowDetails> = [];  
  animalTypes: Array<string> = [Animal.Calf, Animal.Cow, Animal.Bull, Animal.Heifer];  

  constructor(private httpService: HttpService, private farmService: FarmService, private filterService: FilterService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.loadCowsList(farm.farmId);
    });

    this.cowRegistered.subscribe(newCow => {
      if (newCow) {
        this.cowsList.push(newCow);
        //this.applyFiltersAndSort();
        this.cowListState.next(true);
      }
    });

    this.cowDeleted.subscribe(cowId => {
      if (cowId) {
        let cowToDelete = this.cowsList.map(x => x.id).findIndex(x => x == cowId);
        this.cowsList.splice(cowToDelete, 1);
        //this.applyFiltersAndSort();
        this.cowListState.next(true);
      }
    });
  }

  private loadCowsList(farmId) {
    this.getAllCows(farmId, null).then(res => {
      this.cowsList = res['cows'];
      this.filteredCowsList = res['cows'];

      this.cowListState.next(true);
    });
  }

  public getCowsOfTypeInHerd(cowType: string): Array<CowDetails>{
    let cowsByType = this.filterService.applyFilters(this.cowsList, [cowType], 'cowType');
    return this.filterService.applyFilters(cowsByType, [CowState.InHerd.valueOf()], 'cowState');
  }

  public getCowsOfTypeSold(cowType: string): Array<CowDetails>{
    let cowsByType = this.filterService.applyFilters(this.cowsList, [cowType], 'cowType');
    return this.filterService.applyFilters(cowsByType, [CowState.Sold.valueOf()], 'cowState');
  }

  getCow(cowId){
    return this.cowsList.find(x => x.id == cowId);
  }

  getAllCows(farmId, overlayText){
    return this.httpService.get(overlayText, `${environment.url}/api/cow/getAll/${farmId}`);
  }  

  updateCow(cowdetails){    
    return this.httpService.put(`${environment.url}/api/cow/update`, cowdetails);
  }

  deleteCow(cowId, keepRecords){    
    return this.httpService.delete(`${environment.url}/api/cow/delete/${cowId}/${keepRecords}`);
  }

  registerCow(cowdetails) {    
    return this.httpService.post3('Saving...', `${environment.url}/api/cow/register`, cowdetails);
  }  
}
