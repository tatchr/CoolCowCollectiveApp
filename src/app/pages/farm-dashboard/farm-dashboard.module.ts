import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmDashboardPage } from './farm-dashboard.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [FarmDashboardPage]
})
export class FarmDashboardPageModule {}
