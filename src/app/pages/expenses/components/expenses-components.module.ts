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


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule],
    declarations: [ExpenseComponent, FeedExpenseComponent, MedicineExpenseComponent, LabourExpenseComponent, LivestockExpenseComponent, OtherExpenseComponent],
    exports: [ExpenseComponent, FeedExpenseComponent, MedicineExpenseComponent, LabourExpenseComponent, LivestockExpenseComponent, OtherExpenseComponent]
})
export class ExpensesComponentsModule{}