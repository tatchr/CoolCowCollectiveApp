import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkSalesEditPage } from './milk-sales-edit.page';

describe('MilkSalesEditPage', () => {
  let component: MilkSalesEditPage;
  let fixture: ComponentFixture<MilkSalesEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilkSalesEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkSalesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
