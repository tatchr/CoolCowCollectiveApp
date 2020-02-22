import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { MilkSalesBaseComponent } from '../milk-sales-base/milk-sales-base.component';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Period } from 'src/app/common/objects/Enums';

@Component({
  selector: 'app-milk-sales-overview',
  templateUrl: './milk-sales-overview.page.html',
  styleUrls: ['./milk-sales-overview.page.scss'],
})
export class MilkSalesOverviewPage extends MilkSalesBaseComponent implements OnInit {  

  constructor(router: Router, milkSalesService: MilksalesService, formBuilder: FormBuilder, storage: Storage) {
    super(router, milkSalesService, formBuilder, storage);
   }  

  ngOnInit() {    
    this.milkSalesService.milkSaleRegistered.subscribe(newSale => {
      if (newSale) {
        this.milkSalesService.milkSalesList.push(newSale);
        this.milkSalesService.computeTotals();
      }
    });

    this.milkSalesService.milkSaleDeleted.subscribe(milkSaleId => {
      if (milkSaleId) {
        let saleToDelete = this.milkSalesService.milkSalesList.map(x => x.id).findIndex(x => x == milkSaleId);
        this.milkSalesService.milkSalesList.splice(saleToDelete, 1);
        this.milkSalesService.computeTotals();
      }
    });

    this.milkSalesService.milkSaleUpdated.subscribe(sale => {
      if (sale) {
        let saleToUpdate = this.milkSalesService.milkSalesList.map(x => x.id).findIndex(x => x == sale.id);
        this.milkSalesService.milkSalesList[saleToUpdate] = sale;
        this.milkSalesService.computeTotals();
      }
    });
  }

  openMilkSaleRecord(milkSaleId){
    let index = this.milkSalesService.milkSalesList.map(x => x.id).findIndex(x => x == milkSaleId);
    let navigationExtras: NavigationExtras = {
      state: {
        milkSaleDetails: this.milkSalesService.milkSalesList[index]
      }
    };
    this.router.navigate(['milk-sales-edit'], navigationExtras);
  }

  moneyReceived(item){
    item.fullAmountPaid = true;
    this.milkSalesService.updateMilkSalesRecord(item).subscribe();
  }

  moneyNotReceived(item){
    item.fullAmountPaid = false;
    this.milkSalesService.updateMilkSalesRecord(item).subscribe();   
  }

  periodSelected(period){
    this.milkSalesService.selectedPeriod = period;
    this.milkSalesService.periodSelected(period);
  }

  async openFromDatePicker(){
    this.milkSalesService.selectedPeriod = '';
    this.milkSalesService.selectedFromDate = await this.milkSalesService.datePicker.openDatePicker(this.milkSalesService.selectedFromDate);
    this.milkSalesService.loadMilkSalesList();    
  }

  async openToDatePicker(){
    this.milkSalesService.selectedPeriod = '';
    this.milkSalesService.selectedToDate = await this.milkSalesService.datePicker.openDatePicker(this.milkSalesService.selectedToDate);
    this.milkSalesService.loadMilkSalesList();    
  }  
}
