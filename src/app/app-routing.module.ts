import { AuthGuardService } from './services/authService/auth-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register-user', loadChildren: './pages/register-user/register-user.module#RegisterUserPageModule' },  
  { path: 'verify-registration-email', loadChildren: './pages/verify-registration-email/verify-registration-email.module#VerifyRegistrationEmailPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'verify-recovery-email', loadChildren: './pages/verify-recovery-email/verify-recovery-email.module#VerifyRecoveryEmailPageModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'farm-dashboard', loadChildren: './pages/farm-dashboard/farm-dashboard.module#FarmDashboardPageModule', canActivate: [AuthGuardService] },
  { path: 'new-farm', loadChildren: './pages/farm-dashboard/new-farm/new-farm.module#NewFarmPageModule', canActivate: [AuthGuardService] },
  { path: 'register-farm', loadChildren: './pages/farm/register-farm/register-farm.module#RegisterFarmPageModule', canActivate: [AuthGuardService] },
  { path: 'edit-farm', loadChildren: './pages/farm/edit-farm/edit-farm.module#EditFarmPageModule', canActivate: [AuthGuardService] },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },   
  { path: 'milk-entry', loadChildren: './pages/milk-entry/milk-entry.module#MilkEntryPageModule', canActivate: [AuthGuardService] },
  { path: 'register-cow', loadChildren: './pages/cows/register-cow/register-cow.module#RegisterCowPageModule', canActivate: [AuthGuardService] },
  { path: 'cow-passport', loadChildren: './pages/cows/cow-passport/cow-passport.module#CowPassportPageModule', canActivate: [AuthGuardService] },
  { path: 'delete-cow/:cowId', loadChildren: './pages/cows/delete-cow/delete-cow.module#DeleteCowPageModule', canActivate: [AuthGuardService] },
  { path: 'milk-sales-input', loadChildren: './pages/sales/milk-sales/milk-sales-input/milk-sales-input.module#MilkSalesInputPageModule', canActivate: [AuthGuardService] },
  { path: 'milk-sales-edit', loadChildren: './pages/sales/milk-sales/milk-sales-edit/milk-sales-edit.module#MilkSalesEditPageModule', canActivate: [AuthGuardService] },
  { path: 'other-sales-edit', loadChildren: './pages/sales/other-sales/other-sales-edit/other-sales-edit.module#OtherSalesEditPageModule', canActivate: [AuthGuardService] },
  { path: 'other-sales-input', loadChildren: './pages/sales/other-sales/other-sales-input/other-sales-input.module#OtherSalesInputPageModule', canActivate: [AuthGuardService] },
  { path: 'account', loadChildren: './pages/account/account/account.module#AccountPageModule', canActivate: [AuthGuardService] },
  { path: 'change-password', loadChildren: './pages/account/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuardService] },
  { path: 'edit-account', loadChildren: './pages/account/edit-account/edit-account.module#EditAccountPageModule', canActivate: [AuthGuardService] },   
  { path: 'expenses-overview', loadChildren: './pages/expenses/expenses-overview/expenses-overview.module#ExpensesOverviewPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-input', loadChildren: './pages/expenses/expenses-input/expenses-input.module#ExpensesInputPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-edit', loadChildren: './pages/expenses/expenses-edit/expenses-edit.module#ExpensesEditPageModule', canActivate: [AuthGuardService] },   
  { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule', canActivate: [AuthGuardService] },
  { path: 'report-overview', loadChildren: './pages/reports/report-overview/report-overview.module#ReportOverviewPageModule', canActivate: [AuthGuardService] },
  { path: 'herd-report', loadChildren: './pages/reports/herd-report/herd-report.module#HerdReportPageModule', canActivate: [AuthGuardService] },
  { path: 'financial-report', loadChildren: './pages/reports/financial-report/financial-report.module#FinancialReportPageModule', canActivate: [AuthGuardService] },
  { path: 'custom-report', loadChildren: './pages/reports/custom-report/custom-report.module#CustomReportPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-recurring-edit', loadChildren: './pages/expenses/expenses-recurring-edit/expenses-recurring-edit.module#ExpensesRecurringEditPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-menu', loadChildren: './pages/expenses/expenses-menu/expenses-menu.module#ExpensesMenuPageModule', canActivate: [AuthGuardService] },
  { path: 'expenses-recurring-overview', loadChildren: './pages/expenses/expenses-recurring-overview/expenses-recurring-overview.module#ExpensesRecurringOverviewPageModule', canActivate: [AuthGuardService] },   { path: 'sales-menu', loadChildren: './pages/sales/sales-menu/sales-menu.module#SalesMenuPageModule' },  { path: 'expeses-non-recurring-overview', loadChildren: './pages/expenses/expeses-non-recurring-overview/expeses-non-recurring-overview.module#ExpesesNonRecurringOverviewPageModule' },

 


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
