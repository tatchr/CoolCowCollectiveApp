import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MilkEntryPage } from './milk-entry.page';

const routes: Routes = [
  {
    path: '',
    component: MilkEntryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [MilkEntryPage]
})
export class MilkEntryPageModule {}
