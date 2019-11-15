import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OtherSalesOverviewPage } from './other-sales-overview.page';

const routes: Routes = [
  {
    path: '',
    component: OtherSalesOverviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtherSalesOverviewPage]
})
export class OtherSalesOverviewPageModule {}
