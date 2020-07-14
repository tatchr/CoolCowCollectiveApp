import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersalesFormComponent } from './othersales-form.component';

describe('OthersalesFormComponent', () => {
  let component: OthersalesFormComponent;
  let fixture: ComponentFixture<OthersalesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersalesFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersalesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
