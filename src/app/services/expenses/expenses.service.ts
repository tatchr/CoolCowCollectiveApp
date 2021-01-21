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

  livestockExpenseRegistered = new BehaviorSubject<IExpensesDetails>(null);

  changeCounter: number = 0;
  farmId: string;
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  expensesList: Array<IExpensesDetails> = [];
  recurringExpensesList: Array<ExpensesRecurringGroup> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private location: Location,
    public formBuilder: FormBuilder, private farmService: FarmService, private cowService: CowService, private math: MathService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id;

      // this.livestockExpenseRegistered.subscribe((newLivestockExpense: LivestockExpensesDetails) => {
      //   if(newLivestockExpense){
      //     this.expensesList.push(newLivestockExpense);
      //     this.cowService.cowRegistered.next(newLivestockExpense.cow);
      //   }
      // });

      this.expenseRegistered.subscribe(newExpense => {
        if (newExpense) {
          this.loadExpenses(this.selectedFromDate, this.selectedToDate);
          this.loadRecurringExpenses(this.selectedFromDate, this.selectedToDate);
        }
      });
  
      this.expenseDeleted.subscribe(expenseId => {
        if (expenseId) {
          this.loadExpenses(this.selectedFromDate, this.selectedToDate);
          this.loadRecurringExpenses(this.selectedFromDate, this.selectedToDate);
        }
      });
  
      this.expenseUpdated.subscribe(sale => {
        if (sale) {
          this.loadExpenses(this.selectedFromDate, this.selectedToDate);
          this.loadRecurringExpenses(this.selectedFromDate, this.selectedToDate);
        }
      });
    });    
  }

  loadExpenses(fromDate: string, toDate: string){
    var promise = new Promise<void>((resolve) => {
      this.getExpensesRecords(this.farmId, fromDate, toDate)
        .then(response => {
          this.expensesList = response['expensesList'].map(expense => new ExpensesDetails(expense));
          resolve();
        });
    });

    return promise;
  }

  loadRecurringExpenses(fromDate: string, toDate: string){
    var promise = new Promise<void>((resolve) => {
      this.getRecurringExpensesRecords(this.farmId, fromDate, toDate).then(response => {
        this.recurringExpensesList = response['recurringExpensesList'];
        resolve();
      });

    });

    return promise;
  }

  newForm(expense: ExpensesDetails) {
    let form = this.formBuilder.group({
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

    if(expense.id){
      form.addControl('id', new FormControl(expense.id));
    }

    if(expense.registrationDate){
      form.addControl('registrationDate', new FormControl(expense.registrationDate));
    }

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

  private getExpensesRecords(farmId: string, fromDate: string, toDate: string) {
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAll/${farmId}/${fromDate}/${toDate}`);
  }

  private getRecurringExpensesRecords(farmId: string, fromDate: string, toDate: string) {
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAllRecurring/${farmId}/${fromDate}/${toDate}`);
  }

  registerExpensesRecord(record) {
    return this.httpService.post3('Saving...', `${environment.url}/api/expenses/register`, record);
  }

  updateExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/expenses/update`, record);
  }  

  deleteExpensesRecord(id) {
    return this.httpService.delete(`${environment.url}/api/expenses/delete/${id}`);
  }

  deleteExpensesRecurringRecords(recurringId: string) {
    return this.httpService.delete(`${environment.url}/api/expenses/deleteRecurringRecords/${recurringId}`);
  }

  toggleRecurringRecords(recurringId: string, recurringIsActive: boolean) {
    return this.httpService.put(`${environment.url}/api/expenses/stopRecurringRecords/${recurringId}/${recurringIsActive}`, null);
  }

  registerLivestockExpensesRecord(record) {
    return this.httpService.post3('Saving...', `${environment.url}/api/livestockExpenses/register`, record);
  }

  getLivestockExpenseRecord(id) {
    return this.httpService.get(null, `${environment.url}/api/livestockExpenses/get/${id}`);
  }
  
  getLivestockExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    return this.httpService.get('Loading...', `${environment.url}/api/livestockExpenses/getAll/${farmId}/${fromDate}/${toDate}`);
  }

  updateLivestockExpensesRecord(record) {
    return this.httpService.put(`${environment.url}/api/livestockExpenses/update`, record);
  }

  deleteLivestockExpensesRecord(id) {
    return this.httpService.delete(`${environment.url}/api/livestockExpenses/delete/${id}`);
  }
}
