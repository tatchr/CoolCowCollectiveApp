import { AuthGuardService } from './services/authService/auth-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register-user', loadChildren: './pages/register-user/register-user.module#RegisterUserPageModule' },  
  { path: 'verify-registration-email/:email', loadChildren: './pages/verify-registration-email/verify-registration-email.module#VerifyRegistrationEmailPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'verify-recovery-email/:email', loadChildren: './pages/verify-recovery-email/verify-recovery-email.module#VerifyRecoveryEmailPageModule' },
  { path: 'reset-password/:email/:passwordResetCode', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'farm-dashboard', loadChildren: './pages/farm-dashboard/farm-dashboard.module#FarmDashboardPageModule', canActivate: [AuthGuardService] },
  { path: 'register-farm', loadChildren: './pages/farm/register-farm/register-farm.module#RegisterFarmPageModule', canActivate: [AuthGuardService] },
  { path: 'edit-farm', loadChildren: './pages/farm/edit-farm/edit-farm.module#EditFarmPageModule', canActivate: [AuthGuardService] },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },   
  { path: 'milk-entry', loadChildren: './pages/milk-entry/milk-entry.module#MilkEntryPageModule', canActivate: [AuthGuardService] },
  { path: 'tabs/herd', loadChildren: './pages/cows/herd/herd.module#HerdPageModule', canActivate: [AuthGuardService] },
  { path: 'register-cow/:farmId', loadChildren: './pages/cows/register-cow/register-cow.module#RegisterCowPageModule', canActivate: [AuthGuardService] },
  { path: 'cow-passport/:cowId', loadChildren: './pages/cows/cow-passport/cow-passport.module#CowPassportPageModule', canActivate: [AuthGuardService] },
  { path: 'delete-cow/:cowId', loadChildren: './pages/cows/delete-cow/delete-cow.module#DeleteCowPageModule', canActivate: [AuthGuardService] },
  { path: 'milk-sales-input', loadChildren: './pages/sales/milk-sales-input/milk-sales-input.module#MilkSalesInputPageModule', canActivate: [AuthGuardService] },
  { path: 'milk-sales-overview', loadChildren: './pages/sales/milk-sales-overview/milk-sales-overview.module#MilkSalesOverviewPageModule', canActivate: [AuthGuardService] },
  { path: 'milk-sales-edit/:milkSaleId', loadChildren: './pages/sales/milk-sales-edit/milk-sales-edit.module#MilkSalesEditPageModule', canActivate: [AuthGuardService] },
  { path: 'other-sales-edit/:otherSaleId', loadChildren: './pages/sales/other-sales-edit/other-sales-edit.module#OtherSalesEditPageModule', canActivate: [AuthGuardService] },
  { path: 'other-sales-input', loadChildren: './pages/sales/other-sales-input/other-sales-input.module#OtherSalesInputPageModule', canActivate: [AuthGuardService] },
  { path: 'other-sales-overview', loadChildren: './pages/sales/other-sales-overview/other-sales-overview.module#OtherSalesOverviewPageModule', canActivate: [AuthGuardService] },   
  { path: 'account', loadChildren: './pages/account/account/account.module#AccountPageModule', canActivate: [AuthGuardService] },
  { path: 'change-password', loadChildren: './pages/account/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuardService] },
  { path: 'edit-account', loadChildren: './pages/account/edit-account/edit-account.module#EditAccountPageModule', canActivate: [AuthGuardService] },   
  { path: 'expenses-overview', loadChildren: './pages/expenses/expenses-overview/expenses-overview.module#ExpensesOverviewPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-input', loadChildren: './pages/expenses/expenses-input/expenses-input.module#ExpensesInputPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-edit', loadChildren: './pages/expenses/expenses-edit/expenses-edit.module#ExpensesEditPageModule', canActivate: [AuthGuardService] }, 
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
