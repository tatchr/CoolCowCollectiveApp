import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MilksalesFormComponent } from 'src/app/pages/sales/milk-sales/components/milksales-form/milksales-form.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    declarations: [MilksalesFormComponent],
    exports: [MilksalesFormComponent]
})
export class MilksalesComponentsModule{}