import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { OthersalesFormComponent } from 'src/app/pages/sales/other-sales/components/othersales-form/othersales-form.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    declarations: [OthersalesFormComponent],
    exports: [OthersalesFormComponent]
})
export class OthersalesComponentsModule{}