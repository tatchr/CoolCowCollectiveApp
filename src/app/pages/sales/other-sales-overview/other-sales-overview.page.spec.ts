import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSalesOverviewPage } from './other-sales-overview.page';

describe('OtherSalesOverviewPage', () => {
  let component: OtherSalesOverviewPage;
  let fixture: ComponentFixture<OtherSalesOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSalesOverviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSalesOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
