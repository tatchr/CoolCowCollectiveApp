import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MilkSalesEditPage } from './milk-sales-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MilkSalesEditPage
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
  declarations: [MilkSalesEditPage]
})
export class MilkSalesEditPageModule {}
