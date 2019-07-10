import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authService/auth-guard.service';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { 
        path: 'farm-dashboard', 
        loadChildren: '../farm-dashboard/farm-dashboard.module#FarmDashboardPageModule', 
        canActivate: [AuthGuardService] },
      { path: 'menu', 
        loadChildren: '../menu/menu.module#MenuPageModule',
        canActivate: [AuthGuardService] 
      },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/farm-dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
