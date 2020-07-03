import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

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
      aliases: this.formBuilder.array([])
    });
    this.createFormControls();



    // this.verificationForm = this.formBuilder.group({
    //   n1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    //   n2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    //   n3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    //   n4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    //   n5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    //   n6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    // });
  }

  get aliases() {
    return this.verificationForm.get('aliases') as FormArray;
  }

  addAlias() {
    this.aliases.push(
      this.formBuilder.control(
        new FormControl(['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]])
      )
    );
  }

  ngOnInit() { }

  createFormControls() {
    let numberOfBoxes = 6;
    for (var i = 0; i < numberOfBoxes; i++) this.addAlias();
  }

  protected executeCodeResend() {
    this.resendcode.emit();
  }

  protected emitcode(aliases: FormArray) {
    let code: string = '';
    for(let control of aliases.controls){
      code += control.value;
    }

    this.returncode.emit(code);
  }  

  protected moveFocus(event, index) {
    console.log(this.aliases.controls[1].valid);
    let inputs = this.inputs.toArray();

    if (inputs[index].value.length > 1) {
      inputs[index].value = event.key;
    }

    if (event.keyCode == 8 && index > 0) {
      inputs[index].value = '';
      inputs[index - 1].setFocus();
    }
    else if (event.keyCode >= 48 && event.keyCode <= 57 && index < inputs.length - 1) {
      inputs[index + 1].value = '';
      inputs[index + 1].setFocus();
    }
  }  
}
