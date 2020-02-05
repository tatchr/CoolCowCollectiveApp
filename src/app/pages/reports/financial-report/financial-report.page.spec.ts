import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportPage } from './financial-report.page';

describe('FinancialReportPage', () => {
  let component: FinancialReportPage;
  let fixture: ComponentFixture<FinancialReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
