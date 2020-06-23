import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TopbarComponent } from 'src/app/common/components/topbar/topbar.component';
import { Routes, RouterModule } from '@angular/router';
  
@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule],
    declarations: [TopbarComponent],
    exports: [TopbarComponent]
})
export class CommonComponentsModule{}