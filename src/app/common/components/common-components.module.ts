import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TopbarComponent } from 'src/app/common/components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { VerificationCodeInputComponent } from 'src/app/common/components/verification-code-input/verification-code-input.component';
import { ReactiveFormsModule } from '@angular/forms';
  
@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule
    ],
    declarations: [TopbarComponent, VerificationCodeInputComponent],
    exports: [TopbarComponent, VerificationCodeInputComponent]
})
export class CommonComponentsModule{}