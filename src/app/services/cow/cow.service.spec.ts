import { TestBed } from '@angular/core/testing';

import { CowService } from './cow.service';

describe('CowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CowService = TestBed.get(CowService);
    expect(service).toBeTruthy();
  });
});
