import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ExpensesInputPage } from './expenses-input.page';
import { ExpensesComponentsModule } from 'src/app/pages/expenses/components/expenses-components.module';

const routes: Routes = [
  {
    path: '',
    component: ExpensesInputPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensesComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensesInputPage]
})
export class ExpensesInputPageModule {}
