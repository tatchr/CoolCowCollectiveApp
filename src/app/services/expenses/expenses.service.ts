import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  expensesListState = new BehaviorSubject(null);

  constructor(private httpService: HttpService) { }

  getExpenseRecord(id){
    return this.httpService.get(environment.url + '/api/expenses/get/' + id);
  }

  getExpensesRecords(farmId, fromDate, toDate){
    return this.httpService.get(environment.url + '/api/expenses/getAll/' + farmId + "/" + fromDate + "/" + toDate);
  }

  registerExpensesRecord(record) {
    return this.httpService.post(environment.url + '/api/expenses/register', record);
  }

  updateExpensesRecord(record) {
    return this.httpService.put(environment.url + '/api/expenses/update', record);
  }

  deleteExpensesRecord(id) {
    return this.httpService.delete(environment.url + '/api/expenses/delete/' +  id);
  }
}
