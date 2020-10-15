import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesRecurringGroup } from 'src/app/common/objects/ExpensesRecurringGroup';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { CowService } from '../cow/cow.service';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';
import { MathService } from '../math/math.service';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenseRegistered = new BehaviorSubject<IExpensesDetails>(null);
  expenseUpdated = new BehaviorSubject<IExpensesDetails>(null);
  expenseDeleted = new BehaviorSubject<string>(null);

  public expensesLoaded = new BehaviorSubject<Boolean>(null);
  public expensesUpdated = new BehaviorSubject<Boolean>(null);

  public livestockExpenseRegistered = new BehaviorSubject<IExpensesDetails>(null);

  farmId: string;
  selectedFromDate: Date = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: Date = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  expensesList: Array<IExpensesDetails> = [];
  recurringExpensesList: Array<ExpensesRecurringGroup> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private location: Location,
    public formBuilder: FormBuilder, private farmService: FarmService, private cowService: CowService, private math: MathService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.farmId;
      this.loadExpensesList(this.selectedFromDate, this.selectedToDate);
      this.loadRecurringExpensesList(this.selectedFromDate, this.selectedToDate);

      this.livestockExpenseRegistered.subscribe((newLivestockExpense: LivestockExpensesDetails) => {
        if(newLivestockExpense){
          this.expensesList.push(newLivestockExpense);
          this.cowService.cowRegistered.next(newLivestockExpense.cowDetails);
        }
      });

      this.expenseRegistered.subscribe(newExpense => {
        if (newExpense) {
          this.loadExpensesList(this.selectedFromDate, this.selectedToDate);
          this.loadRecurringExpensesList(this.selectedFromDate, this.selectedToDate);
        }
      });
  
      this.expenseDeleted.subscribe(expenseId => {
        if (expenseId) {
          this.loadExpensesList(this.selectedFromDate, this.selectedToDate);
          this.loadRecurringExpensesList(this.selectedFromDate, this.selectedToDate);
        }
      });
  
      this.expenseUpdated.subscribe(sale => {
        if (sale) {
          this.loadExpensesList(this.selectedFromDate, this.selectedToDate);
          this.loadRecurringExpensesList(this.selectedFromDate, this.selectedToDate);
        }
      });
    });    
  }

  public newForm(expense: ExpensesDetails) {
    let form = this.formBuilder.group({
      id: [expense.id],
      farmId: [expense.farmId],
      date: [expense.date],
      type: [expense.type],
      itembought: [expense.itemBought, [Validators.required]],
      price: [expense.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
      quantity: [expense.quantity, [Validators.required, Validators.min(1), Validators.max(10000)]],
      quantityUnit: [expense.quantityUnit],
      totalprice: [{ value: 0.0, disabled: true }],
      cowname: [expense.cowName],
      cowstatus: [expense.cowStatus],
      sellername: [expense.sellerName],
      sellercompany: [expense.sellerCompany],
      isrootrecord: [expense.isRootRecord],
      recurringisactive: [expense.recurringIsActive],
      recurringFromDate: [expense.recurringFromDate],
      recurringid: [expense.recurringId],
      recurringperiodindays: [expense.recurringPeriodInDays]
    });

    form.valueChanges.subscribe(val => {
      let totalprice = this.math.round(val['price'] * val['quantity'], 2);
      form.get('totalprice').patchValue(totalprice, { emitEvent: false });
    });

    form.get('recurringisactive').valueChanges.subscribe((isActive: boolean) => {
      if(isActive){
        form.addControl('recurringperiodindays', new FormControl(null, [Validators.required]));
      }
      else{
        form.removeControl('recurringperiodindays');
      }
    });

    return form;
  }

  public loadExpensesList(fromDate: Date, toDate: Date){
    this.getExpensesRecords(this.farmId, fromDate, toDate).then(expenses => {
      this.getLivestockExpensesRecords(this.farmId, fromDate, toDate).then(livestockExpenses => {
        let expensesList = expenses['expensesList'].map(x => new ExpensesDetails(x));
        let livestockExpensesList = livestockExpenses['livestockExpensesList'].map(x => new LivestockExpensesDetails(x))

        this.expensesList = expensesList.concat(livestockExpensesList);
        this.expensesLoaded.next(true);
      });
    });
  }

  public loadRecurringExpensesList(fromDate: Date, toDate: Date) {
    this.getRecurringExpensesRecords(this.farmId, fromDate, toDate).then(res => {
      this.recurringExpensesList = res['recurringExpensesList'];
    });
  }

  private getExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAll/${farmId}/${from}/${to}`);
  }

  private getRecurringExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAllRecurring/${farmId}/${from}/${to}`);
  }

  public registerExpensesRecord(record) {
    return this.httpService.post3('Saving...', `${environment.url}/api/expenses/register`, record);
  }

  public updateExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/expenses/update`, record);
  }

  public updateRootExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/expenses/updateRootExpense`, record);
  }

  public deleteExpensesRecord(id) {
    return this.httpService.delete(`${environment.url}/api/expenses/delete/${id}`);
  }

  public deleteExpensesRecurringRecords(recurringId: string) {
    return this.httpService.delete(`${environment.url}/api/expenses/deleteRecurringRecords/${recurringId}`);
  }

  public toggleRecurringRecords(recurringId: string, recurringIsActive: boolean) {
    return this.httpService.put(`${environment.url}/api/expenses/stopRecurringRecords/${recurringId}/${recurringIsActive}`, null);
  }

  public registerLivestockExpensesRecord(record) {
    return this.httpService.post3('Saving...', `${environment.url}/api/livestockExpenses/register`, record);
  }

  public getLivestockExpenseRecord(id) {
    return this.httpService.get(null, `${environment.url}/api/livestockExpenses/get/${id}`);
  }
  
  public getLivestockExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', `${environment.url}/api/livestockExpenses/getAll/${farmId}/${from}/${to}`);
  }

  public updateLivestockExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/livestockExpenses/update`, record);
  }

  public deleteLivestockExpensesRecord(id) {
    return this.httpService.delete(`${environment.url}/api/livestockExpenses/delete/${id}`);
  }
}
