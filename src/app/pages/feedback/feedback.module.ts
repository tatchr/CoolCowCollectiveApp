import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { StarRatingModule } from 'ionic4-star-rating';


import { IonicModule } from '@ionic/angular';

import { FeedbackPage } from './feedback.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: FeedbackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    StarRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackPage]
})
export class FeedbackPageModule {}
