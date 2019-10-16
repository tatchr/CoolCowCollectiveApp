import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CowService {  

  cowListState = new BehaviorSubject(null);

  constructor(private httpService: HttpService) { }

  getCow(cowId){
    return this.httpService.get(environment.url + '/api/cow/get/' + cowId);
  }

  getAllCows(farmId){
    return this.httpService.get(environment.url + '/api/cow/getAll/' + farmId);
  }

  updateCow(cowdetails){
    return this.httpService.put(environment.url + '/api/cow/update', cowdetails);
  }

  deleteCow(cowId, keepRecords){
    return this.httpService.delete(environment.url + '/api/cow/delete/' + cowId + '/' + keepRecords);
  }

  registerCow(cowdetails) {
    return this.httpService.post(environment.url + '/api/cow/register', cowdetails);
  }  
}
