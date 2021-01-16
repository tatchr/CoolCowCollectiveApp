import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CowInputPage } from './cow-input.page';

describe('CowInputPage', () => {
  let component: CowInputPage;
  let fixture: ComponentFixture<CowInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CowInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CowInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
