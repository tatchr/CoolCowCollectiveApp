import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensesOverviewPage } from './expenses-overview.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import { ExpensesComponentsModule } from 'src/app/pages/expenses/components/expenses-components.module';

const routes: Routes = [
  {
    path: '',
    component: ExpensesOverviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule,
    ExpensesComponentsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensesOverviewPage]
})
export class ExpensesOverviewPageModule {}
