import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CowFormComponent } from './cow-form.component';

describe('CowFormComponent', () => {
  let component: CowFormComponent;
  let fixture: ComponentFixture<CowFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CowFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
