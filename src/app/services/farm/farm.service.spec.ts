import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FarmService } from './farm.service';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';

describe('FarmService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let alertService: AlertService;
  let farmService: FarmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    alertService = TestBed.get(AlertService);
    farmService = new FarmService(httpClient, alertService);
  });

  it('should be created', () => {
    expect(farmService).toBeTruthy();
  });


  describe('GetAllFarms', () => {
    it('should get list of all farms of the user', () => {
      const jsonResult = {
        farms: [
        {
          id: '1',
          name: 'name',
          email: 'email',
          phone: '1111111',
          address: 'address',
          county: 'county',
          country: 'country',
          description: 'description',
          registrationDate: ''
        },
        {
          id: '2',
          name: 'name1',
          email: 'email',
          phone: '11111112',
          address: 'address2',
          county: 'county3',
          country: 'country4',
          description: 'description5'
        }]
      };

      let userId = 1;

      farmService.getAllFarms(userId).subscribe(x => {
        expect(x).toEqual(jsonResult);
      });

      const req = httpTestingController.expectOne(environment.url + '/api/farm/getAll/' + userId);

      expect(req.request.method).toEqual('GET');

      req.flush(jsonResult);
      httpTestingController.verify();
    });
  });
});
