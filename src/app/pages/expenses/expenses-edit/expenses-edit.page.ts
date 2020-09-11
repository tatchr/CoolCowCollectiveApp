import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';

@Component({
  selector: 'app-expenses-edit',
  templateUrl: './expenses-edit.page.html',
  styleUrls: ['./expenses-edit.page.scss'],
})
export class ExpensesEditPage implements OnInit {

  protected selectedDate: Date;
  protected expensesDetails: ExpensesDetails;
  protected livestockExpensesDetails: LivestockExpensesDetails;

  constructor(private router: Router, public expensesService: ExpensesService,
    private activatedRoute: ActivatedRoute, private alertService: AlertService) { 
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.expensesDetails = this.router.getCurrentNavigation().extras.state.expenseDetails;
        }
      });
    }

  ngOnInit() {
    //this.service.initiateExistingForm(this.expensesDetails);
  }

  onSubmit(expensesForm) {    
    console.log(expensesForm);

    this.expensesService.updateExpensesRecord(expensesForm.getRawValue()).subscribe(val =>{
      if(val){
        this.expensesService.expenseUpdated.next(this.expensesDetails);
        this.router.navigate(['/expenses-overview'], { replaceUrl: true });
      }
    });    
  }

  onSubmitLivestock(livestockExpensesForm) {
    console.log(livestockExpensesForm);
    // this.expensesService.registerLivestockExpensesRecord(livestockExpensesForm.value).then(val => {
    //   if (val['livestockExpense']) {
    //     this.expensesService.livestockExpenseRegistered.next(val['livestockExpense']);

    //     this.router.navigate(['/expenses-overview'], { replaceUrl: true });
    //   }
    // });
  }

  protected onDelete(expenseId) {
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this expense record?';
    let confirmAction = () => {
      this.expensesService.deleteExpensesRecord(expenseId).subscribe(val => {
        if (val) {
          this.expensesService.expenseDeleted.next(expenseId);
          this.router.navigate(['/expenses-overview'], { replaceUrl: true });
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }

}
