import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'app-expenses-base',
  templateUrl: './expenses-base.component.html',
  styleUrls: ['./expenses-base.component.scss'],
})
export class ExpensesBaseComponent implements OnInit {

  expensesForm: FormGroup;
  farmId: string;
  selectedDateString: string = this.datePicker.formatDate(new Date()); 

  constructor(protected router: Router, protected expensesService: ExpensesService, protected formBuilder: FormBuilder, 
    protected storage: Storage, protected datePicker: DatepickerService) { }

  ngOnInit() {}

  returnToOverview(){
    this.expensesService.expensesListState.next(true);
    this.router.navigateByUrl('/tabs/expenses-overview');
  }

  getFarmId(){
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;      
    });
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  async openDatePicker(){
    this.selectedDateString = await this.datePicker.openDatePicker(this.selectedDateString);    
  }

}
