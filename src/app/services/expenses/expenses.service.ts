import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  expensesListState = new BehaviorSubject(null);
  expenseRegistered = new BehaviorSubject<ExpensesDetails>(null);
  expenseUpdated = new BehaviorSubject<ExpensesDetails>(null);
  expenseDeleted = new BehaviorSubject<number>(null);

  farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());

  expensesList: Array<ExpensesDetails> = [];
  selectedPeriod: string = Period.lastweek;

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadExpensesList();
    });
  }

  loadExpensesList(){
    this.getExpensesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {
      this.expensesList = res['expensesDetails'];      
    });
  }

  periodSelected(period){
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);
    
    this.selectedToDate = result.toDate;
    this.selectedFromDate = result.fromDate;    
    
    this.loadExpensesList();  
  }
  
  getExpenseRecord(id){
    return this.httpService.get(environment.url + '/api/expenses/get/' + id);
  }

  getExpensesRecords(farmId, fromDate, toDate){
    return this.httpService.get2('Loading...', environment.url + '/api/expenses/getAll/' + farmId + "/" + fromDate + "/" + toDate);
  }

  registerExpensesRecord(record) {
    return this.httpService.post3('Saving...', environment.url + '/api/expenses/register', record);
  }

  updateExpensesRecord(record) {
    return this.httpService.put(environment.url + '/api/expenses/update', record);
  }

  deleteExpensesRecord(id) {
    return this.httpService.delete(environment.url + '/api/expenses/delete/' +  id);
  }
}
