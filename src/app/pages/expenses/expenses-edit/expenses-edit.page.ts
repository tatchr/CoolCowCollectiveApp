import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';
import { IExpensesDetails } from 'src/app/common/interfaces/IExpensesDetails';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { Location } from '@angular/common';
import { CowService } from 'src/app/services/cow/cow.service';

@Component({
  selector: 'app-expenses-edit',
  templateUrl: './expenses-edit.page.html',
  styleUrls: ['./expenses-edit.page.scss'],
})
export class ExpensesEditPage implements OnInit {
  
  expensesDetails: any;

  constructor(private router: Router, public expensesService: ExpensesService,
    private activatedRoute: ActivatedRoute, private alertService: AlertService, private location: Location,
    private cowService: CowService) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.expensesDetails = this.router.getCurrentNavigation().extras.state.expensesDetails;
      }
    });
  }

  ngOnInit() { }

  get isLivestock() {
    return this.expensesDetails instanceof LivestockExpensesDetails;
  }

  onSubmit(expensesForm) {
    if (this.isLivestock) {
      this.expensesService.updateLivestockExpensesRecord(expensesForm.value).subscribe(response => {
        if (response.status == 200) {
          this.expensesService.livestockExpenseRegistered.next(response.body['livestockExpense']);
          this.location.back();        
        }
      });
    }
    else {
      this.expensesService.updateExpensesRecord(expensesForm.getRawValue()).subscribe(response => {
        if (response.status == 200) {
          this.expensesService.expenseUpdated.next(response.body['expense']);
          this.location.back();
        }
      });
    }
  }

  onDelete(expense: IExpensesDetails) {
    if(this.isLivestock){
      this.deleteLivestockExpense(expense);
    }
    else{
      let expensesDetails = new ExpensesDetails(expense);
      if(expensesDetails.isRootRecord){
        this.deleteRecurringRootRecord(expensesDetails);
      }
      else{
      this.deleteExpensesRecord(expense.id);
      }
    }
  }

  private deleteExpensesRecord(expenseId: string){
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

  private deleteLivestockExpense(expense: IExpensesDetails){
    let header = 'Delete this record?';
    let message = 'Are you sure that you want to permanently delete this expense record? This action will also delete the corresponding cow and its production records.';
    let confirmAction = () => {
      this.expensesService.deleteLivestockExpensesRecord(expense.id).subscribe(val => {
        if (val) {
          let livestockExpense = new LivestockExpensesDetails(expense);
          this.expensesService.expenseDeleted.next(livestockExpense.id);
          this.location.back();
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }

  private deleteRecurringRootRecord(expense: ExpensesDetails){
    let header = 'Delete recurring records?';
    let message = 'Deleting this root record will also delete all of its corresponding historical child records. Are you sure?';
    let confirmAction = () => {
      this.expensesService.deleteExpensesRecurringRecords(expense.recurringId).subscribe(val => {
        if (val) {
          this.expensesService.expenseDeleted.next(expense.id);
          this.location.back();
        }
      });
    };
    this.alertService.presentAlertConfirm(header, message, confirmAction);
  }
}
