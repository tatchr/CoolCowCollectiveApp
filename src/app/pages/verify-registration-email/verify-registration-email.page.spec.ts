import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRegistrationEmailPage } from './verify-registration-email.page';

describe('VerifyRegistrationEmailPage', () => {
  let component: VerifyRegistrationEmailPage;
  let fixture: ComponentFixture<VerifyRegistrationEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyRegistrationEmailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyRegistrationEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
