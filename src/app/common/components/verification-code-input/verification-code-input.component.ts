import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'verification-code-input',
  templateUrl: './verification-code-input.component.html',
  styleUrls: ['./verification-code-input.component.scss'],
})
export class VerificationCodeInputComponent implements OnInit {

  @Output() returncode = new EventEmitter<string>();
  @Output() resendcode = new EventEmitter();

  protected verificationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.verificationForm = this.formBuilder.group({
      n1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      n6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    });
  }

  ngOnInit() { }

  protected executeCodeResend(){
    this.resendcode.emit();
  }

  protected emitcode(form: FormGroup) {
    let code: string = '';
    for (const field in form.controls) { 
      const { value: number } = form.get(field); 
      code += number;
    }
    
    this.returncode.emit(code);
  }

  protected moveFocus(event, nextElement, previousElement) {

    if (event.keyCode == 8 && previousElement) {
      //   console.log(event);
      // console.log(nextElement);
      // console.log(previousElement);
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = '';
    }
  }

  checkInput(element, nextElement) {
    let input = element.value;
    if (input != null && input != "") {
      if (input.length > 1) {
        element.value = null;
      }
      else {
        if (nextElement != null) {
          nextElement.setFocus();
        }
      }
    }
  }
}
