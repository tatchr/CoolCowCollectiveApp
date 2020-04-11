import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { Animal } from 'src/app/common/objects/Enums';
import { Storage } from '@ionic/storage';

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

  farmId: number;

  constructor(private httpService: HttpService, private storage: Storage) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadCowsList(farmId);
    });    
  }

  loadCowsList(farmId) {
    this.getAllCows(farmId, null).then(res => {
      this.cowsList = res['cows'];
      this.filteredCowsList = res['cows'];
    });
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
