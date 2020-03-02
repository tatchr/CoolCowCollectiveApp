import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensesRecurringEditPage } from './expenses-recurring-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensesRecurringEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensesRecurringEditPage]
})
export class ExpensesRecurringEditPageModule {}
