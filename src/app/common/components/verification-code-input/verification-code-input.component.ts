import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'verification-code-input',
  templateUrl: './verification-code-input.component.html',
  styleUrls: ['./verification-code-input.component.scss'],
})
export class VerificationCodeInputComponent implements OnInit {
  @ViewChildren('inputs') inputs: QueryList<any>;
  @Output() returncode = new EventEmitter<string>();
  @Output() resendcode = new EventEmitter();

  protected verificationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.verificationForm = this.formBuilder.group({
      numberBoxes: this.formBuilder.array(this.createNumberboxControls())
    });
  }  

  ngOnInit() { }

  public reset(){
    this.verificationForm.reset();
  }

  private createNumberboxControls() {
    let numberBoxes = [];
    let numberOfBoxes = 6;
    for (var i = 0; i < numberOfBoxes; i++) {
      numberBoxes.push(this.createNumberbox());
    }

    return numberBoxes;
  }

  private createNumberbox(){
    return this.formBuilder.control(
      '', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
    );
  }

  protected executeCodeResend() {
    this.resendcode.emit();
  }

  protected get numberBoxes() {
    return this.verificationForm.get('numberBoxes') as FormArray;
  }  

  protected emitcode(numberBoxes: FormArray) {
    let code: string = '';
    for(let control of numberBoxes.controls){
      code += control.value;
    }

    this.returncode.emit(code);
  } 

  protected moveFocusOnBackspace(index){
    let inputs = this.inputs.toArray();
    let currentInput = inputs[index];

    if(currentInput.value === '' && index > 0){
      inputs[index - 1].setFocus();
    }
  }

  protected moveFocus(event, index){
    let inputs = this.inputs.toArray();
    if (inputs[index].value.length > 1) {
      inputs[index].value = event.key;
    }

    let isNumber = event.keyCode >= 48 && event.keyCode <= 57;
    if (isNumber && index < inputs.length - 1) {
      inputs[index + 1].setFocus();
    }
  }
}
