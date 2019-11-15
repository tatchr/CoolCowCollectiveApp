import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MilkSalesOverviewPage } from './milk-sales-overview.page';

const routes: Routes = [
  {
    path: '',
    component: MilkSalesOverviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MilkSalesOverviewPage]
})
export class MilkSalesOverviewPageModule {}
