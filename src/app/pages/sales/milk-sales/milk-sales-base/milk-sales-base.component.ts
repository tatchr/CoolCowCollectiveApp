import { Component } from '@angular/core';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
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
  selectedDate: string = this.milkSalesService.datePicker.formatDate(new Date());

  constructor(protected router: Router, public milkSalesService: MilksalesService, protected formBuilder: FormBuilder, 
    protected storage: Storage) { }   

  returnToOverview(){
    this.router.navigateByUrl('/tabs/milk-sales-overview');
  }

  async openDatePicker(){
    this.selectedDate = await this.milkSalesService.datePicker.openDatePicker(this.selectedDate);    
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
