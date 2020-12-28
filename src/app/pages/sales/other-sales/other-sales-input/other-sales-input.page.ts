import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OthersalesService } from 'src/app/services/sales/othersales/othersales.service';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { OthersalesFormComponent } from '../components/othersales-form/othersales-form.component';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-other-sales-input',
  templateUrl: './other-sales-input.page.html',
  styleUrls: ['./other-sales-input.page.scss'],
})
export class OtherSalesInputPage implements OnInit {
  @ViewChild(OthersalesFormComponent) othersalesFormComponent: OthersalesFormComponent;

  othersalesDetails: OtherSalesDetails;
  cowSelector: Array<CowDetails> = [];
  selectedDate: string = this.datePicker.today;

  constructor(private router: Router, private otherSalesService: OthersalesService, private farmService: FarmService,
    private datePicker: DatepickerService) {}

  ngOnInit() {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.othersalesDetails = new OtherSalesDetails({
        farmId: farm.id
      });
    });
  }

  async openDatePicker() {
    this.selectedDate = await this.datePicker.openDatePicker(this.selectedDate);
  }  

  onSubmit(othersalesForm) {
    this.otherSalesService.registerOtherSalesRecord(othersalesForm.value).then(val => {
      if(val['otherSale']){
        this.otherSalesService.otherSaleRegistered.next(val['otherSale']);
        this.router.navigateByUrl('/tabs/other-sales-overview');
      }
    });
  }
}
