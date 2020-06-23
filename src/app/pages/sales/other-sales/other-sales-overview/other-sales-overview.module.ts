import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OtherSalesOverviewPage } from './other-sales-overview.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';

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
    CommonComponentsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtherSalesOverviewPage]
})
export class OtherSalesOverviewPageModule {}
