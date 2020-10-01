import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CowPodiumChartComponent } from './cow-podium-chart.component';

describe('CowPodiumChartComponent', () => {
  let component: CowPodiumChartComponent;
  let fixture: ComponentFixture<CowPodiumChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CowPodiumChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CowPodiumChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
