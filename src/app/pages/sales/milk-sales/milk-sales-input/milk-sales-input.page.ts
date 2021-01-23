import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { FarmService } from 'src/app/services/farm/farm.service';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';

@Component({
  selector: 'app-milk-sales-input',
  templateUrl: './milk-sales-input.page.html',
  styleUrls: ['./milk-sales-input.page.scss'],
})
export class MilkSalesInputPage implements OnInit {

  milksalesDetails: MilkSalesDetails;
  selectedDate: string = this.datePicker.today;

  constructor(private router: Router, private milkSalesService: MilksalesService, 
    private farmService: FarmService, private datePicker: DatepickerService) { }

  ngOnInit() {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.milksalesDetails = new MilkSalesDetails({
        farmId: farm.id
      });
    });
  } 

  onSubmit(milksalesForm) {
    this.milkSalesService.registerMilkSalesRecord(milksalesForm.value).then(response => {
      this.milkSalesService.milkSaleRegistered.next(response['milkSale']);
      this.router.navigateByUrl('/tabs/milk-sales-overview');
    });
  }

  async openDatePicker() {
    this.selectedDate = await this.datePicker.openDatePicker(this.selectedDate);
  }
}
