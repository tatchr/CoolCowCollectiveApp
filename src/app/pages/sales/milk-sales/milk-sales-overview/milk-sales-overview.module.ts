import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MilkSalesOverviewPage } from './milk-sales-overview.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';


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
    CommonComponentsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MilkSalesOverviewPage]
})
export class MilkSalesOverviewPageModule {}
