import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { VerifyRegistrationEmailPage } from './verify-registration-email.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: VerifyRegistrationEmailPage
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
  declarations: [VerifyRegistrationEmailPage]
})
export class VerifyRegistrationEmailPageModule {}
