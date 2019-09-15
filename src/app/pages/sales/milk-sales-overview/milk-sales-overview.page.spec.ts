import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkSalesOverviewPage } from './milk-sales-overview.page';

describe('MilkSalesOverviewPage', () => {
  let component: MilkSalesOverviewPage;
  let fixture: ComponentFixture<MilkSalesOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilkSalesOverviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkSalesOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
