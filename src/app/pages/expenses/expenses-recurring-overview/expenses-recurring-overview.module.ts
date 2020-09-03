import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensesRecurringOverviewPage } from './expenses-recurring-overview.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import { ExpensesComponentsModule } from 'src/app/pages/expenses/components/expenses-components.module';

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
    CommonComponentsModule,
    ExpensesComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensesRecurringOverviewPage]
})
export class ExpensesRecurringOverviewPageModule {}
