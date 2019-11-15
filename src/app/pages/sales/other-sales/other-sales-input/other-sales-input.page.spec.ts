import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSalesInputPage } from './other-sales-input.page';

describe('OtherSalesInputPage', () => {
  let component: OtherSalesInputPage;
  let fixture: ComponentFixture<OtherSalesInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSalesInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSalesInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
