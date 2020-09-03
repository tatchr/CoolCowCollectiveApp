import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OthersalesService } from 'src/app/services/sales/othersales/othersales.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { OtherSalesDetails } from 'src/app/common/objects/OtherSalesDetails';

@Component({
  selector: 'app-other-sales-edit',
  templateUrl: './other-sales-edit.page.html',
  styleUrls: ['./other-sales-edit.page.scss'],
})
export class OtherSalesEditPage implements OnInit {
  
  othersalesDetails: OtherSalesDetails;
  selectedDate: Date = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private otherSalesService: OthersalesService, private alertService: AlertService) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        let sale = this.router.getCurrentNavigation().extras.state.otherSaleDetails;
        this.selectedDate = sale.date;
        this.othersalesDetails = sale;
      }
    });
  }

  async openDatePicker() {
    this.selectedDate = await this.otherSalesService.datePicker.openDatePicker(this.selectedDate);
  }

  ngOnInit() { }

  onSubmit(othersalesForm) {
    this.otherSalesService.updateOtherSalesRecord(othersalesForm.getRawValue()).subscribe(val => {
      if (val) {
        this.otherSalesService.otherSaleUpdated.next(val['otherSale']);
        this.router.navigateByUrl('/tabs/other-sales-overview');
      }
    });    
  }  

  onDelete(id) {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this sales record?';
    let confirmAction = () => {
      this.otherSalesService.deleteOtherSalesRecord(id).subscribe(val => {
        if (val) {
          this.otherSalesService.otherSaleDeleted.next(id);
          this.router.navigateByUrl('/tabs/other-sales-overview');
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }
}
