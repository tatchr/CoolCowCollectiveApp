import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CowInputPage } from './cow-input.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import { CowComponentsModule } from '../components/cow-components.module';

const routes: Routes = [
  {
    path: '',
    component: CowInputPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule,
    ReactiveFormsModule,
    CowComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CowInputPage]
})
export class CowInputPageModule {}
