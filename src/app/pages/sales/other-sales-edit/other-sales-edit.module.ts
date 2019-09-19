import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OtherSalesEditPage } from './other-sales-edit.page';

const routes: Routes = [
  {
    path: '',
    component: OtherSalesEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtherSalesEditPage]
})
export class OtherSalesEditPageModule {}
