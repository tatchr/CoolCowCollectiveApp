import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { MilkSalesBaseComponent } from '../milk-sales-base/milk-sales-base.component';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FarmService } from 'src/app/services/farm/farm.service';

@Component({
  selector: 'app-milk-sales-overview',
  templateUrl: './milk-sales-overview.page.html',
  styleUrls: ['./milk-sales-overview.page.scss']
})
export class MilkSalesOverviewPage extends MilkSalesBaseComponent implements OnInit {  

  constructor(router: Router, milkSalesService: MilksalesService, formBuilder: FormBuilder, 
    storage: Storage, farmService: FarmService) {
    super(router, milkSalesService, formBuilder, storage, farmService);
   }  

  ngOnInit() {    
    this.milkSalesService.milkSaleRegistered.subscribe(newSale => {
      if (newSale) {
        this.milkSalesService.milkSalesList.push(newSale);
        this.milkSalesService.changeCounter += 1;        
        this.milkSalesService.computeTotals();
      }
    });

    this.milkSalesService.milkSaleDeleted.subscribe(milkSaleId => {
      if (milkSaleId) {
        let saleToDelete = this.milkSalesService.milkSalesList.findIndex(x => x.id == milkSaleId);
        this.milkSalesService.milkSalesList.splice(saleToDelete, 1);
        this.milkSalesService.changeCounter += 1;
        this.milkSalesService.computeTotals();
      }
    });

    this.milkSalesService.milkSaleUpdated.subscribe(sale => {
      if (sale) {
        this.milkSalesService.milkSalesList = this.milkSalesService.milkSalesList.map(x => (x.id == sale.id) ? sale : x);
        this.milkSalesService.changeCounter += 1;
        this.milkSalesService.computeTotals();
      }
    });
  }

  openMilkSaleRecord(milkSale){
    let navigationExtras: NavigationExtras = {
      state: {
        milkSaleDetails: milkSale
      }
    };
    this.router.navigate(['milk-sales-edit'], navigationExtras);
  }

  moneyReceived(item){
    item.fullAmountPaid = true;
    this.milkSalesService.updateMilkSalesRecord(item).subscribe(() => {
      this.milkSalesService.computeTotals();   
    });
  }

  moneyNotReceived(item){
    item.fullAmountPaid = false;
    this.milkSalesService.updateMilkSalesRecord(item).subscribe(() => {
      this.milkSalesService.computeTotals();   
    });    
  }

  protected dateChanged(){
    this.milkSalesService.loadMilkSalesList();
  }
}
