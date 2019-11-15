import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSalesEditPage } from './other-sales-edit.page';

describe('OtherSalesEditPage', () => {
  let component: OtherSalesEditPage;
  let fixture: ComponentFixture<OtherSalesEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSalesEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSalesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
