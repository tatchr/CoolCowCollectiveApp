import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FeedExpenseComponent } from 'src/app/pages/expenses/components/feed-expense/feed-expense.component';
import { MedicineExpenseComponent } from 'src/app/pages/expenses/components/medicine-expense/medicine-expense.component';
import { LabourExpenseComponent } from 'src/app/pages/expenses/components/labour-expense/labour-expense.component';
import { LivestockExpenseComponent } from 'src/app/pages/expenses/components/livestock-expense/livestock-expense.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule],
    declarations: [FeedExpenseComponent, MedicineExpenseComponent, LabourExpenseComponent, LivestockExpenseComponent],
    exports: [FeedExpenseComponent, MedicineExpenseComponent, LabourExpenseComponent, LivestockExpenseComponent]
})
export class ExpensesComponentsModule{}