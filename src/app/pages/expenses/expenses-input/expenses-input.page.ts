import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.page.html',
  styleUrls: ['./expenses-input.page.scss'],
})
export class ExpensesInputPage implements OnInit {

  expensesForm: FormGroup;
  farmId: string;
  datePickerObj: any;
  selectedDateString: string = this.datePicker.formatDate(new Date());

  constructor(private router: Router, private expensesService: ExpensesService, private formBuilder: FormBuilder, 
    private storage: Storage, private datePicker: DatepickerService) { }

    ngOnInit() {
      let fromDate = new Date('2016-01-01');
      let toDate = new Date();
      this.datePickerObj = this.datePicker.getDatepickerObj(this.selectedDateString, fromDate, toDate);
  
      this.initiate();
    }
  
    initiate() {
      this.storage.get('farmId').then(farmId => {
        this.farmId = farmId;      
      });
  
      this.initiateForm();
    }
  
    initiateForm(){
      this.expensesForm = this.formBuilder.group({
        farmId: [this.farmId],
        date: [this.selectedDateString],
        type: [null, [Validators.required]],
        itembought: [null, [Validators.required]],
        price: [null, [Validators.required, Validators.min(0.0)]],
        quantity: [null, [Validators.required, Validators.min(1)]],
        sellername: [null, [Validators.required]],
        sellercompany: [null],
        isrecurring: [false],
        recurringperiodindays: [0]
      });
  
      // this.expensesForm.valueChanges.subscribe(val => {
      //   let totalPrice = this.round(val['literssold'] * val['priceperliter'], 2);      
      //   this.expensesForm.get('totalPrice').patchValue(totalPrice, {emitEvent: false});
      // });
    }
  
    round(number, decimals){
      return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    itemSelected(event) {
      // this.showOtherInput = event.detail.value == 'Other';
      // this.showSpermInput = event.detail.value == 'Sperm';
      // this.showCowList = this.animalTypes.includes(event.detail.value);
      // if (this.showCowList) {
      //   this.loadCowsList(event.detail.value);
      // }
    }

    onSubmit() {
      if(this.expensesForm.valid){
        this.expensesForm.controls['farmId'].setValue(this.farmId);
        this.expensesForm.controls['date'].setValue(this.selectedDateString);
        this.expensesService.registerExpensesRecord(this.expensesForm.value).subscribe(val => {
          if(val){
            this.returnToOverview();
          }
        });
      }    
    }
  
    returnToOverview(){
      this.expensesService.expensesListState.next(true);
      this.router.navigateByUrl('/tabs/expenses-overview');
    }
  
    async openDatePicker() {
      this.datePickerObj.inputDate = this.selectedDateString;
      const datePickerModal = await this.datePicker.getDatePickerModal(this.datePickerObj);
  
      await datePickerModal.present();
      datePickerModal.onDidDismiss().then((data) => {
        if (typeof data.data !== 'undefined' && data.data.date !== 'Invalid date') {
          this.selectedDateString = this.datePicker.formatDate(data.data.date);
        }
      });
    }

}
