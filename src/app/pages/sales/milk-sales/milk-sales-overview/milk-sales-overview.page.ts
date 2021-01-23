import { Component, OnInit } from '@angular/core';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-milk-sales-overview',
  templateUrl: './milk-sales-overview.page.html',
  styleUrls: ['./milk-sales-overview.page.scss']
})
export class MilkSalesOverviewPage implements OnInit {  

  constructor(private router: Router, private milkSalesService: MilksalesService) { }  

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

  openNewMilkSaleRecord() {
    this.router.navigate(['milk-sales-input']);
  }

  openMilkSaleRecord(milkSale){
    let navigationExtras: NavigationExtras = {
      state: {
        milkSaleDetails: milkSale
      }
    };
    this.router.navigate(['milk-sales-edit'], navigationExtras);
  }

  moneyReceived(milkSale){
    milkSale.fullAmountPaid = true;
    this.milkSalesService.updateMilkSalesRecord(milkSale).subscribe(() => {
      this.milkSalesService.computeTotals();   
    });
  }

  dateChanged(){
    this.milkSalesService.loadMilkSalesList();
  }
}
