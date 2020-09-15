import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmDashboardPage } from './farm-dashboard.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import { FarmDashboardChartComponentsModule } from './components/farm-dashboard-chart-components.module';

const routes: Routes = [
  {
    path: '',
    component: FarmDashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule,
    FarmDashboardChartComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FarmDashboardPage]
})
export class FarmDashboardPageModule {}
