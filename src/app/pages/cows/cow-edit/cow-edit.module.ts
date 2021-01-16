import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CowEditPage } from './cow-edit.page';
import { CommonComponentsModule } from 'src/app/common/components/common-components.module';
import { CowComponentsModule } from '../components/cow-components.module';

const routes: Routes = [
  {
    path: '',
    component: CowEditPage
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
  declarations: [CowEditPage]
})
export class CowEditPageModule {}
