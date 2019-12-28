import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class MilkService {

  constructor(private httpService: HttpService) { }

  getAllMilkRecords(farmId, date, timeOfDay){
    return this.httpService.get2('Loading...', environment.url + '/api/milkproduction/getAll/' + farmId + "/" + date + "/" + timeOfDay);
  }

  registerMilkRecords(records) {
    return this.httpService.post3('Saving...', environment.url + '/api/milkproduction/register', records);
  }
}
