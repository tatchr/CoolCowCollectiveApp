import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HerdPage } from './herd.page';

describe('HerdPage', () => {
  let component: HerdPage;
  let fixture: ComponentFixture<HerdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HerdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
