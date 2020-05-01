import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesRecurringGroup } from 'src/app/common/objects/ExpensesRecurringGroup';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {  
 
  changeCounter: number = 0;
  expenseRegistered = new BehaviorSubject<ExpensesDetails>(null);
  public expenseUpdated = new BehaviorSubject<ExpensesDetails>(null);
  expenseDeleted = new BehaviorSubject<string>(null);

  farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());
  selectedPeriod: string = Period.lastweek;

  expensesList: Array<ExpensesDetails> = [];
  recurringExpensesList: Array<ExpensesRecurringGroup> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadExpensesList();
      this.loadRecurringExpensesList();
    });
  }

  loadExpensesList(){
    this.getExpensesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {
      this.expensesList = res['expensesList'];
    });
  }

  loadRecurringExpensesList(){
    this.getRecurringExpensesRecords(this.farmId, this.selectedFromDate, this.selectedToDate).then(res => {      
      this.recurringExpensesList = res['recurringExpensesList'];
    });
  } 

  periodSelected(period){
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);
    
    this.selectedToDate = result.toDate;
    this.selectedFromDate = result.fromDate;    
    
    this.loadExpensesList();
    this.loadRecurringExpensesList();  
  }
  
  getExpenseRecord(id){
    return this.httpService.get(null, `${environment.url}/api/expenses/get/${id}`);
  }

  getExpensesRecords(farmId: string, fromDate: string, toDate: string){
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAll/${farmId}/${fromDate}/${toDate}`);
  }

  getRecurringExpensesRecords(farmId: string, fromDate: string, toDate: string) {
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAllRecurring/${farmId}/${fromDate}/${toDate}`);
  }

  registerExpensesRecord(record) {
    return this.httpService.post3('Saving...', `${environment.url}/api/expenses/register`, record);
  }

  updateExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/expenses/update`, record);
  }

  updateRootExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/expenses/updateRootExpense`, record);
  }

  deleteExpensesRecord(id) {
    return this.httpService.delete(`${environment.url}/api/expenses/delete/${id}`);
  }

  deleteExpensesRecurringRecords(recurringId: string) {
    return this.httpService.delete(`${environment.url}/api/expenses/deleteRecurringRecords/${recurringId}`);
  }

  toggleRecurringRecords(recurringId: string, recurringIsActive: boolean){
    return this.httpService.put(`${environment.url}/api/expenses/stopRecurringRecords/${recurringId}/${recurringIsActive}`, null);
  }
}
