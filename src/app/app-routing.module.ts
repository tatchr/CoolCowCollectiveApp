import { AuthGuardService } from './services/authService/auth-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register-user', loadChildren: './pages/register-user/register-user.module#RegisterUserPageModule' },
  { 
    path: 'inside', 
    loadChildren: './pages/inside/inside.module#InsidePageModule',
    canActivate: [AuthGuardService]
  },   
  { path: 'verify-registration-email/:email', loadChildren: './pages/verify-registration-email/verify-registration-email.module#VerifyRegistrationEmailPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'verify-recovery-email/:email', loadChildren: './pages/verify-recovery-email/verify-recovery-email.module#VerifyRecoveryEmailPageModule' },
  { path: 'reset-password/:email/:passwordResetCode', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'farm-overview/:userId', loadChildren: './pages/farm-overview/farm-overview.module#FarmOverviewPageModule', canActivate: [AuthGuardService] },
  { path: 'register-farm/:userId', loadChildren: './pages/register-farm/register-farm.module#RegisterFarmPageModule', canActivate: [AuthGuardService] },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
