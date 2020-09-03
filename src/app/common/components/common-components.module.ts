import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TopbarComponent } from 'src/app/common/components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { VerificationCodeInputComponent } from 'src/app/common/components/verification-code-input/verification-code-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatepickerComponent } from 'src/app/common/components/datepicker/datepicker.component';
  
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule
    ],
    declarations: [TopbarComponent, VerificationCodeInputComponent, DatepickerComponent],
    exports: [TopbarComponent, VerificationCodeInputComponent, DatepickerComponent]
})
export class CommonComponentsModule{}