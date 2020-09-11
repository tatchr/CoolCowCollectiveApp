import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesRecurringGroup } from 'src/app/common/objects/ExpensesRecurringGroup';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { CowService } from '../cow/cow.service';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';
import { MathService } from '../math/math.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  expensesForm: FormGroup;
  selectedType: string;

  changeCounter: number = 0;
  expenseRegistered = new BehaviorSubject<ExpensesDetails>(null);
  public expenseUpdated = new BehaviorSubject<ExpensesDetails>(null);
  expenseDeleted = new BehaviorSubject<string>(null);

  livestockExpenseRegistered = new BehaviorSubject<LivestockExpensesDetails>(null);

  farmId: string;
  selectedDate: Date = this.datePicker.today;
  selectedFromDate: Date = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: Date = this.datePicker.today;
  selectedPeriod: string = Period.lastweek;

  expensesList: Array<ExpensesDetails> = [];
  livestockExpensesList: Array<LivestockExpensesDetails> = [];
  recurringExpensesList: Array<ExpensesRecurringGroup> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private location: Location,
    public formBuilder: FormBuilder, private farmService: FarmService, private cowService: CowService, private math: MathService) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.farmId;
      this.loadExpensesList(this.selectedFromDate, this.selectedToDate);
      this.loadLivestockExpensesList(this.selectedFromDate, this.selectedToDate);
      this.loadRecurringExpensesList(this.selectedFromDate, this.selectedToDate);
    });

    this.livestockExpenseRegistered.subscribe((newLivestockExpense: LivestockExpensesDetails) => {
      if(newLivestockExpense){
        this.livestockExpensesList.push(newLivestockExpense);
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

  loadExpensesList(fromDate: Date, toDate: Date) {
    this.getExpensesRecords(this.farmId, fromDate, toDate).then(res => {
      this.expensesList = res['expensesList'];
    });
  }

  loadRecurringExpensesList(fromDate: Date, toDate: Date) {
    this.getRecurringExpensesRecords(this.farmId, fromDate, toDate).then(res => {
      this.recurringExpensesList = res['recurringExpensesList'];
    });
  }

  loadLivestockExpensesList(fromDate: Date, toDate: Date) {
    this.getLivestockExpensesRecords(this.farmId, fromDate, toDate).then(res => {
      this.livestockExpensesList = res['livestockExpensesList'];
    });
  }

  periodSelected(period) {
    this.selectedPeriod = period;
    let result = this.datePicker.periodSelected(period);

    this.loadExpensesList(result.fromDate, result.toDate);
    this.loadRecurringExpensesList(result.fromDate, result.toDate);
  }


  returnToOverview() {
    this.location.back();
  }

  typeSelected(event) {
    this.selectedType = event.detail.value;
  }

  async openDatePicker() {
    this.selectedDate = await this.datePicker.openDatePicker(this.selectedDate);
  }

  initiateExistingForm(expenseDetails: ExpensesDetails) {
    this.selectedDate = expenseDetails.date;
    this.selectedType = expenseDetails.type;
    this.expensesForm = this.formBuilder.group({
      id: expenseDetails.id,
      farmId: expenseDetails.farmId,
      date: this.selectedDate,
      type: [this.selectedType, [Validators.required]],
      itembought: [expenseDetails.itemBought, [Validators.required]],
      price: [expenseDetails.price, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
      quantity: [expenseDetails.quantity, [Validators.required, Validators.min(1), Validators.max(10000)]],
      quantityUnit: [expenseDetails.quantityUnit],
      totalprice: [{ value: expenseDetails.totalPrice, disabled: true }],
      cowname: [null],
      cowstatus: [null],
      sellername: [expenseDetails.sellerName],
      sellercompany: [expenseDetails.sellerCompany],
      isrootrecord: [expenseDetails.isRootRecord],
      recurringisactive: [expenseDetails.recurringIsActive],
      recurringFromDate: [expenseDetails.recurringFromDate],
      recurringId: [expenseDetails.recurringId]
    });

    this.expensesForm.valueChanges.subscribe(val => {
      let totalPrice = this.math.round(val['price'] * val['quantity'], 2);
      this.expensesForm.get('totalprice').patchValue(totalPrice, { emitEvent: false });
    });
  }

  getExpenseRecord(id) {
    return this.httpService.get(null, `${environment.url}/api/expenses/get/${id}`);
  }

  getExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAll/${farmId}/${from}/${to}`);
  }

  getRecurringExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', `${environment.url}/api/expenses/getAllRecurring/${farmId}/${from}/${to}`);
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

  toggleRecurringRecords(recurringId: string, recurringIsActive: boolean) {
    return this.httpService.put(`${environment.url}/api/expenses/stopRecurringRecords/${recurringId}/${recurringIsActive}`, null);
  }

  registerLivestockExpensesRecord(record: LivestockExpensesDetails) {
    return this.httpService.post3('Saving...', `${environment.url}/api/livestockExpenses/register`, record);
  }

  getLivestockExpenseRecord(id) {
    return this.httpService.get(null, `${environment.url}/api/livestockExpenses/get/${id}`);
  }
  
  getLivestockExpensesRecords(farmId: string, fromDate: Date, toDate: Date) {
    let from = this.datePicker.formatDate(fromDate);
    let to = this.datePicker.formatDate(toDate);
    return this.httpService.get('Loading...', `${environment.url}/api/livestockExpenses/getAll/${farmId}/${from}/${to}`);
  }
}
