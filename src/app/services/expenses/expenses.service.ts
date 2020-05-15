import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Storage } from '@ionic/storage';
import { Period } from 'src/app/common/objects/Enums';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { ExpensesRecurringGroup } from 'src/app/common/objects/ExpensesRecurringGroup';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

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

  farmId: string;
  selectedDate: string = this.datePicker.formatDate(new Date()); 
  selectedFromDate: string = this.datePicker.subtract(new Date(), 7, 'days');
  selectedToDate: string = this.datePicker.formatDate(new Date());
  selectedPeriod: string = Period.lastweek;

  expensesList: Array<ExpensesDetails> = [];
  recurringExpensesList: Array<ExpensesRecurringGroup> = [];

  constructor(private httpService: HttpService, public datePicker: DatepickerService, private storage: Storage, 
    private location: Location, public formBuilder: FormBuilder, private router: Router) { 
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;
      this.loadExpensesList();
      this.loadRecurringExpensesList();
    });

    this.expenseRegistered.subscribe(newExpense => {
      if (newExpense) {
        this.loadExpensesList(); 
        this.loadRecurringExpensesList(); 
      }
    });

    this.expenseDeleted.subscribe(expenseId => {
      if (expenseId) {
        this.loadExpensesList();
        this.loadRecurringExpensesList();
      }
    });

    this.expenseUpdated.subscribe(sale => {
      if (sale) {
        this.loadExpensesList();
        this.loadRecurringExpensesList();
      }
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

  shouldContainValueIfIsRecurringToggled(group: FormGroup): { [s: string]: boolean }{
    let containsValue = group.value != null;

    if(this.expensesForm && this.expensesForm.controls.recurringisactive.value){
      return containsValue ? null : { isInvalid: true }
    }

    return null;
  }

  isRecurringToggled(event){
    if(event.detail.checked){
      this.expensesForm.addControl('recurringperiodindays', new FormControl(null, [this.shouldContainValueIfIsRecurringToggled.bind(this)]));
    }
    else{
      this.expensesForm.removeControl('recurringperiodindays');
    }
  }

  returnToOverview(){
    this.location.back();
  }

  typeSelected(event){
    this.initiateNewForm();
    this.selectedType = event.detail.value;
  }

  async openDatePicker(){
    this.selectedDate = await this.datePicker.openDatePicker(this.selectedDate);    
  } 

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  initiateNewForm() {
    this.expensesForm = this.formBuilder.group({
      id: uuidv4(),
      farmId: [this.farmId],
      date: [this.selectedDate],
      type: [null],
      itembought: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.0), Validators.max(100000.0)]],
      quantity: [null, [Validators.required, Validators.min(1), Validators.max(10000)]],
      quantityUnit: [null],
      totalprice: [{ value: 0.0, disabled: true }],
      sellername: [null],
      sellercompany: [null],
      recurringisactive: [false],
      recurringFromDate: [null],
      registrationDate: [null]
    });    

    this.expensesForm.valueChanges.subscribe(val => {
      let totalprice = this.round(val['price'] * val['quantity'], 2);
      this.expensesForm.get('totalprice').patchValue(totalprice, { emitEvent: false });
    });
  }

  initiateExistingForm(expenseDetails: ExpensesDetails){
    this.selectedDate = this.datePicker.formatDate(expenseDetails.date);
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
      sellername: [expenseDetails.sellerName],
      sellercompany: [expenseDetails.sellerCompany],
      isrootrecord: [expenseDetails.isRootRecord],
      recurringisactive: [expenseDetails.recurringIsActive],
      recurringFromDate: [expenseDetails.recurringFromDate],
      recurringId: [expenseDetails.recurringId],
      registrationDate: [expenseDetails.registrationDate],
      updateDate: [null]
    });    
    
    this.expensesForm.valueChanges.subscribe(val => {      
      let totalPrice = this.round(val['price'] * val['quantity'], 2);
      this.expensesForm.get('totalprice').patchValue(totalPrice, { emitEvent: false });
    });
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
