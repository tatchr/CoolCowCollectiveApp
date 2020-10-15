import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { ExpensesDetails } from 'src/app/common/objects/ExpensesDetails';
import { LivestockExpensesDetails } from 'src/app/common/objects/LivestockExpensesDetails';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';

@Component({
  selector: 'app-expenses-input',
  templateUrl: './expenses-input.page.html',
  styleUrls: ['./expenses-input.page.scss'],
})
export class ExpensesInputPage implements OnInit {

  protected selectedDate = this.datePicker.today;
  protected expensesDetails: ExpensesDetails;
  protected livestockExpensesDetails: LivestockExpensesDetails;

  constructor(private router: Router, public expensesService: ExpensesService, private farmService: FarmService,
    private datePicker: DatepickerService) { }

  ngOnInit() {
    this.farmService.getFarm().then((farm: FarmDetails) => {

      console.log('farm: ');

      console.log(farm);

      this.expensesDetails = new ExpensesDetails({
        farmId: farm.farmId,
        date: this.expensesService.datePicker.today,
        isRootRecord: false,
        recurringIsActive: false
      });

      this.livestockExpensesDetails = new LivestockExpensesDetails({
        farmId: farm.farmId,
        date: this.expensesService.datePicker.today,
        cowDetails: new CowDetails()
      });
    });
  }

  onSubmit(expensesForm) {
    this.expensesService.registerExpensesRecord(expensesForm.getRawValue()).then(val => {
      if (val['expense']) {
        this.expensesService.expenseRegistered.next(val['expense']);

        let isRecurring = expensesForm.value['recurringisactive'];
        if (isRecurring) {
          this.router.navigate(['/expenses-recurring-overview'], { replaceUrl: true });
        }
        else {
          this.router.navigate(['/expenses-overview'], { replaceUrl: true });
        }
      }
    });
  }

  onSubmitLivestock(livestockExpensesForm) {
    this.expensesService.registerLivestockExpensesRecord(livestockExpensesForm.value).then(val => {
      if (val['livestockExpense']) {
        let registeredRecord = new LivestockExpensesDetails(val['livestockExpense']);        
        this.expensesService.livestockExpenseRegistered.next(registeredRecord);

        this.router.navigate(['/expenses-overview'], { replaceUrl: true });
      }
    });
  }
}
