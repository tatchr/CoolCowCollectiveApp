import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/services/sales/sales.service';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { CowService } from 'src/app/services/cow/cow.service';
import { CowDetails } from 'src/app/common/objects/CowDetails';

@Component({
  selector: 'app-other-sales-base',
  templateUrl: './other-sales-base.component.html',
  styleUrls: ['./other-sales-base.component.scss'],
})
export class OtherSalesBaseComponent implements OnInit {

  othersalesForm: FormGroup; 
  cowsList: Array<CowDetails> = [];
  farmId: string;
  fromDate = new Date('2016-01-01');
  toDate = new Date();
  selectedDateString: string = this.datePicker.formatDate(new Date());

  showCowList: boolean;
  showOtherInput: boolean;
  showSpermInput: boolean;
  animalTypes: Array<string> = ['Calf', 'Cow', 'Bull', 'Heifer'];
  otherItemDescription: string = "";
    
  constructor(protected router: Router, protected salesService: SalesService, protected cowService: CowService, protected formBuilder: FormBuilder,
    protected storage: Storage, protected datePicker: DatepickerService) { }

  ngOnInit() {}  

  getFarmId(){
    this.storage.get('farmId').then(farmId => {
      this.farmId = farmId;      
    });
  }  

  async openDatePicker(){
    this.selectedDateString = await this.datePicker.openDatePicker(this.fromDate, this.toDate, this.selectedDateString);    
  }

  round(number, decimals){
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
