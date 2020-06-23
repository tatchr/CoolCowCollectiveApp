import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ExpensesEditPage } from './expenses-edit.page';
import { ExpensesComponentsModule } from 'src/app/pages/expenses/components/expenses-components.module';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: ExpensesEditPage
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
  declarations: [ExpensesEditPage]
})
export class ExpensesEditPageModule {}
