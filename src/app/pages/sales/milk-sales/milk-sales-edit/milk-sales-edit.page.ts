import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MilksalesService } from 'src/app/services/sales/milksales/milksales.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MilkSalesDetails } from 'src/app/common/objects/MilkSalesDetails';

@Component({
  selector: 'app-milk-sales-edit',
  templateUrl: './milk-sales-edit.page.html',
  styleUrls: ['./milk-sales-edit.page.scss'],
})
export class MilkSalesEditPage implements OnInit {

  milksalesDetails: MilkSalesDetails;
  selectedDate: string;

  constructor(private router: Router, private milkSalesService: MilksalesService, 
    private activatedRoute: ActivatedRoute, private alertService: AlertService) {
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          let sale = this.router.getCurrentNavigation().extras.state.milkSaleDetails;
          this.selectedDate = sale.date;
          this.milksalesDetails = sale;
        }
      });
  }

  ngOnInit() { }

  onSubmit(milksalesForm) {
    this.milkSalesService.updateMilkSalesRecord(milksalesForm.value).subscribe(response => {
      if (response.status == 200) {
        this.milkSalesService.milkSaleUpdated.next(response.body['milkSale']);
        this.router.navigateByUrl('/tabs/milk-sales-overview');
      }
    });
  }

  onDelete(id) {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this milk sales record?';
    let confirmAction = () => {
      this.milkSalesService.deleteMilkSalesRecord(id).subscribe(response => {
        if (response.status == 204) {
          this.milkSalesService.milkSaleDeleted.next(id);
          this.router.navigateByUrl('/tabs/milk-sales-overview');
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }

  async openDatePicker() {
    this.selectedDate = await this.milkSalesService.datePicker.openDatePicker(this.selectedDate);
  }
}
