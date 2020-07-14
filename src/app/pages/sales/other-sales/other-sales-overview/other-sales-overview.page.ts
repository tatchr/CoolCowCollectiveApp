import { Component, OnInit } from '@angular/core';
import { OthersalesService } from 'src/app/services/sales/othersales/othersales.service';
import { Router, NavigationExtras } from '@angular/router';
import { CowService } from 'src/app/services/cow/cow.service';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';

@Component({
  selector: 'app-other-sales-overview',
  templateUrl: './other-sales-overview.page.html',
  styleUrls: ['./other-sales-overview.page.scss'],
})
export class OtherSalesOverviewPage implements OnInit {  

  constructor(private router: Router, public otherSalesService: OthersalesService, private cowService: CowService) { }

  ngOnInit() {
    this.otherSalesService.otherSaleRegistered.subscribe(newSale => {
      if (newSale) {
        this.otherSalesService.otherSalesList.push(newSale);

        let isCowSold = this.cowService.animalTypes.includes(newSale.itemSold);
        if (isCowSold) {
          this.cowService.cowSold.next(newSale.cowIdSold);
        }
        this.otherSalesService.changeCounter += 1;
      }
    });

    this.otherSalesService.otherSaleDeleted.subscribe(milkSaleId => {
      if (milkSaleId) {
        let saleToDelete = this.otherSalesService.otherSalesList.map(x => x.id).findIndex(x => x == milkSaleId);
        this.otherSalesService.otherSalesList.splice(saleToDelete, 1);
        this.otherSalesService.changeCounter += 1;
      }
    });

    this.otherSalesService.otherSaleUpdated.subscribe(sale => {
      if (sale) {
        let saleToUpdate = this.otherSalesService.otherSalesList.map(x => x.id).findIndex(x => x == sale.id);
        this.otherSalesService.otherSalesList[saleToUpdate] = sale;
        this.otherSalesService.changeCounter += 1;
      }
    });
  }

  openNewOtherSaleRecord() {
    let navigationExtras: NavigationExtras = {
      state: {
        //cowsList: this.cowService.cowsList
      }
    };
    this.router.navigate(['other-sales-input'], navigationExtras);
  }

  openOtherSaleRecord(otherSale: OtherSalesDetails) {    
    let navigationExtras: NavigationExtras = {
      state: {
        otherSaleDetails: otherSale
      }
    };
    this.router.navigate(['other-sales-edit'], navigationExtras);
  }

  moneyReceived(item) {
    item.fullAmountPaid = true;
    this.otherSalesService.updateOtherSalesRecord(item).subscribe();
  }

  moneyNotReceived(item) {
    item.fullAmountPaid = false;
    this.otherSalesService.updateOtherSalesRecord(item).subscribe();
  }

  periodSelected(period){
    this.otherSalesService.selectedPeriod = period;
    this.otherSalesService.periodSelected(period);
  }

  async openFromDatePicker(){
    this.otherSalesService.selectedPeriod = '';
    this.otherSalesService.selectedFromDate = await this.otherSalesService.datePicker.openDatePicker(this.otherSalesService.selectedFromDate);
    this.otherSalesService.loadOtherSalesList();    
  }

  async openToDatePicker(){
    this.otherSalesService.selectedPeriod = '';
    this.otherSalesService.selectedToDate = await this.otherSalesService.datePicker.openDatePicker(this.otherSalesService.selectedToDate);
    this.otherSalesService.loadOtherSalesList();    
  }
}
