import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'app-expenses-base',
  templateUrl: './expenses-base.component.html',
  styleUrls: ['./expenses-base.component.scss'],
})
export class ExpensesBaseComponent implements OnInit {

  expensesForm: FormGroup;
  farmId: string;
  selectedDate: string = this.expensesService.datePicker.formatDate(new Date()); 

  constructor(protected router: Router, protected expensesService: ExpensesService, protected formBuilder: FormBuilder, 
    protected storage: Storage) { }

  ngOnInit() {}

  shouldContainValueIfIsRecurringToggled(group: FormGroup): { [s: string]: boolean }{
    let containsValue = group.value != null;

    if(this.expensesForm && this.expensesForm.controls.isrecurring.value){
      return containsValue ? null : { isInvalid: true }
    }

    return null;
  }

  returnToOverview(){
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
    this.selectedDate = await this.expensesService.datePicker.openDatePicker(this.selectedDate);    
  }

}
