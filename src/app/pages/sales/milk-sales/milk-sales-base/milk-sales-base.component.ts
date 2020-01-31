import { Component, OnInit } from '@angular/core';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { SalesService } from 'src/app/services/sales/sales.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-milk-sales-base',
  templateUrl: './milk-sales-base.component.html',
  styleUrls: ['./milk-sales-base.component.scss'],
})
export class MilkSalesBaseComponent {

  milksalesForm: FormGroup;
  farmId: string;
  fromDate = new Date('2016-01-01');
  toDate = new Date();
  selectedDateString: string = this.datePicker.formatDate(new Date());

  constructor(protected router: Router, protected salesService: SalesService, protected formBuilder: FormBuilder, 
    protected storage: Storage, protected datePicker: DatepickerService) { }  

  getFarmId(){
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;      
    });
  }

  returnToOverview(){
    this.router.navigateByUrl('/tabs/milk-sales-overview');
  }

  async openDatePicker(){
    this.selectedDateString = await this.datePicker.openDatePicker(this.fromDate, this.toDate, this.selectedDateString);    
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
