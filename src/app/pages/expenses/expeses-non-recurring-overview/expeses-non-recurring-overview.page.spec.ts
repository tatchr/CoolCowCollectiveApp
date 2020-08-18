import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpesesNonRecurringOverviewPage } from './expeses-non-recurring-overview.page';

describe('ExpesesNonRecurringOverviewPage', () => {
  let component: ExpesesNonRecurringOverviewPage;
  let fixture: ComponentFixture<ExpesesNonRecurringOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpesesNonRecurringOverviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpesesNonRecurringOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
