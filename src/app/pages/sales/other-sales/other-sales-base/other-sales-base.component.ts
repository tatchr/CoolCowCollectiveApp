import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { OthersalesService } from 'src/app/services/sales/othersales/othersales.service';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-other-sales-base',
  templateUrl: './other-sales-base.component.html',
  styleUrls: ['./other-sales-base.component.scss'],
})
export class OtherSalesBaseComponent {

  othersalesForm: FormGroup;
  selectedDate: string = this.otherSalesService.datePicker.formatDate(new Date());

  showCowList: boolean;
  showOtherInput: boolean;
  showSpermInput: boolean;

  otherItemDescription: string = "";

  constructor(protected router: Router, protected otherSalesService: OthersalesService, protected cowService: CowService, protected formBuilder: FormBuilder,
    protected storage: Storage) { }

  async openDatePicker() {
    this.selectedDate = await this.otherSalesService.datePicker.openDatePicker(this.selectedDate);
  }

  round(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  returnToOverview() {
    this.router.navigateByUrl('/tabs/other-sales-overview');
  }
}
