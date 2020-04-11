import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesGroup } from 'src/app/common/objects/ExpensesGroup';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {  
 
  expenseRegistered = new BehaviorSubject<ExpensesDetails>(null);
  public expenseUpdated = new BehaviorSubject<ExpensesDetails>(null);
  expenseDeleted = new BehaviorSubject<number>(null);

  farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());
  selectedPeriod: string = Period.lastweek;

  nonRecurringExpensesList: Array<ExpensesDetails> = [];
  recurringExpensesList: Array<ExpensesGroup> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadExpensesList();
    });
  }

  loadExpensesList(){
    this.getExpensesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {
      this.nonRecurringExpensesList = res['expensesResult']['nonRecurringExpensesList'];
      this.recurringExpensesList = res['expensesResult']['recurringExpensesList'];
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
    return this.httpService.get(null, environment.url + '/api/expenses/get/' + id);
  }

  getExpensesRecords(farmId, fromDate, toDate){
    return this.httpService.get('Loading...', environment.url + '/api/expenses/getAll/' + farmId + "/" + fromDate + "/" + toDate);
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

  deleteExpensesRecurringRecords(recurringId: string) {
    return this.httpService.delete(environment.url + '/api/expenses/deleteRecurringRecords/' +  recurringId);
  }
}
