import { TestBed } from '@angular/core/testing';

import { FarmDashboardDataService } from './farm-dashboard-data.service';

describe('FarmDashboardDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FarmDashboardDataService = TestBed.get(FarmDashboardDataService);
    expect(service).toBeTruthy();
  });
});
