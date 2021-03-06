import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OtherSalesEditPage } from './other-sales-edit.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import { OthersalesComponentsModule } from 'src/app/pages/sales/other-sales/components/othersales-components.module';

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
    CommonComponentsModule,
    ReactiveFormsModule,
    OthersalesComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtherSalesEditPage]
})
export class OtherSalesEditPageModule {}
