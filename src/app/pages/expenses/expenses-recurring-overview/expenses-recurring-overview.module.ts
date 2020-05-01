import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensesRecurringOverviewPage } from './expenses-recurring-overview.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensesRecurringOverviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensesRecurringOverviewPage]
})
export class ExpensesRecurringOverviewPageModule {}
