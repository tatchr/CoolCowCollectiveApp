import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkSalesInputPage } from './milk-sales-input.page';

describe('MilkSalesInputPage', () => {
  let component: MilkSalesInputPage;
  let fixture: ComponentFixture<MilkSalesInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilkSalesInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkSalesInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
