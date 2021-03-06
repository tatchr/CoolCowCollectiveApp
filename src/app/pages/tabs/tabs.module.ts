import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/authService/auth-guard.service';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'farm-dashboard',
        loadChildren: '../farm-dashboard/farm-dashboard.module#FarmDashboardPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'milk-entry',
        loadChildren: '../milk-entry/milk-entry.module#MilkEntryPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'herd',
        loadChildren: '../cows/herd/herd.module#HerdPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'sales-menu',
        loadChildren: '../sales/sales-menu/sales-menu.module#SalesMenuPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'menu',
        loadChildren: '../menu/menu.module#MenuPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'milk-sales-overview',
        loadChildren: '../sales/milk-sales/milk-sales-overview/milk-sales-overview.module#MilkSalesOverviewPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'other-sales-overview',
        loadChildren: '../sales/other-sales/other-sales-overview/other-sales-overview.module#OtherSalesOverviewPageModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'expenses-menu',
        loadChildren: '../expenses/expenses-menu/expenses-menu.module#ExpensesMenuPageModule',
        canActivate: [AuthGuardService]
      },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/farm-dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuardService]
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
export class TabsPageModule { }
