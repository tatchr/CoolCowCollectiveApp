import { Component } from '@angular/core';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';

@Component({
  selector: 'app-milk-sales-base',
  templateUrl: './milk-sales-base.component.html',
  styleUrls: ['./milk-sales-base.component.scss'],
})
export class MilkSalesBaseComponent {

  milksalesForm: FormGroup;
  selectedDate: Date = this.milkSalesService.datePicker.today;
  farmId: string;

  constructor(public router: Router, public milkSalesService: MilksalesService, public formBuilder: FormBuilder, 
    public storage: Storage, public farmService: FarmService) { }   

  getFarmId(){
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.farmId; 
    });
  }

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
