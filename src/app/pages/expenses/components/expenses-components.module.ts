import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FeedExpenseComponent } from 'src/app/pages/expenses/components/feed-expense/feed-expense.component';
import { MedicineExpenseComponent } from 'src/app/pages/expenses/components/medicine-expense/medicine-expense.component';
import { LabourExpenseComponent } from 'src/app/pages/expenses/components/labour-expense/labour-expense.component';
import { LivestockExpenseComponent } from 'src/app/pages/expenses/components/livestock-expense/livestock-expense.component';
import { IonicModule } from '@ionic/angular';
import { ExpenseComponent } from 'src/app/pages/expenses/components/expense/expense.component';
import { OtherExpenseComponent } from './other-expense/other-expense.component';
import { NonRecurringOverviewComponent } from 'src/app/pages/expenses/components/non-recurring-overview/non-recurring-overview.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RecurringOverviewComponent } from 'src/app/pages/expenses/components/recurring-overview/recurring-overview.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        ReactiveFormsModule],
    declarations: [ExpenseComponent, FeedExpenseComponent, MedicineExpenseComponent, LabourExpenseComponent, LivestockExpenseComponent, OtherExpenseComponent,
        NonRecurringOverviewComponent, RecurringOverviewComponent],
    exports: [ExpenseComponent, FeedExpenseComponent, MedicineExpenseComponent, LabourExpenseComponent, LivestockExpenseComponent, OtherExpenseComponent,
        NonRecurringOverviewComponent, RecurringOverviewComponent]
})
export class ExpensesComponentsModule{}