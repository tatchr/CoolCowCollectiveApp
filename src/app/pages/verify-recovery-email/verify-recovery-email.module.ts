import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerifyRecoveryEmailPage } from './verify-recovery-email.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: VerifyRecoveryEmailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerifyRecoveryEmailPage]
})
export class VerifyRecoveryEmailPageModule {}
