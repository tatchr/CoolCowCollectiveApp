import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CowDetails } from 'src/app/common/objects/CowDetails';
import { Animal, CowState } from 'src/app/common/objects/Enums';
import { FarmService } from 'src/app/services/farm/farm.service';
import { FarmDetails } from 'src/app/common/objects/FarmDetails';
import { List } from 'immutable';
import { HttpClient } from '@angular/common/http';
import { map, catchError, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CowService {

  private _cows: BehaviorSubject<List<CowDetails>> = new BehaviorSubject(List([]));
  public readonly cows$: Observable<List<CowDetails>> = this._cows.asObservable();
  
  farmId: string;

  filteredCowsList: Array<CowDetails> = [];  
  animalTypes: Array<string> = [Animal.Calf, Animal.Cow, Animal.Bull, Animal.Heifer];  

  constructor(private farmService: FarmService, private http: HttpClient) {
    this.farmService.getFarm().then((farm: FarmDetails) => {
      this.farmId = farm.id;

      this.loadInitialData(farm.id);
    });
  }

  loadInitialData(farmId) {
    this.http.get(`${environment.url}/farms/${farmId}/cows`)
      .subscribe(res => {
        let cows = res['cows'];
        this._cows.next(List(cows));
      });
  }

  add(cow) {
    let obs = this.http.post(`${environment.url}/farms/${this.farmId}/cows`, cow).pipe(share());

    obs.subscribe(
      res => {
        console.log(res);
        this._cows.next(this._cows.getValue().push(res['cow']));
      });

    return obs;
  }

  update(updatedCow){
    let obs = this.http.put(`${environment.url}/farms/${this.farmId}/cows`, updatedCow, { observe: 'response' }).pipe(share());

    obs.subscribe(
      res => {
        if(res.status == 200){
          let cows = this._cows.getValue();
          let index = cows.findIndex(cow => cow.id === updatedCow.id);

          this._cows.next(cows.set(index, res.body['cow']));
        }
      }
    );

    return obs;
  }

  delete(deletedCow, keepRecords){
    let obs = this.http.delete(`${environment.url}/farms/${this.farmId}/cows/${deletedCow.id}?keep_records=${keepRecords}`).pipe(share());

    obs.subscribe(
      res => {
        let cows = this._cows.getValue();
        let index = cows.findIndex(cow => cow.id === deletedCow.id);

        this._cows.next(cows.delete(index));
      }
    );

    return obs;
  }

  cowSold(cowId){
    let cows = this._cows.getValue();
    let index = cows.findIndex(cow => cow.id === cowId);
    let cow = cows.get(index);

    cow.cowState = CowState.Sold;

    this._cows.next(cows.set(index, cow));
  }

  getCowsOfTypeInHerd(cowType: string): Observable<List<CowDetails>>{
    return this.cows$.pipe(
      map(
        cows => cows.filter(cow => cow.cowType === cowType && cow.cowState === CowState.InHerd.valueOf())
      ));
  }

  getCowsOfTypeSold(cowType: string): Observable<List<CowDetails>>{
    return this.cows$.pipe(
      map(
        cows => cows.filter(cow => cow.cowType === cowType && cow.cowState === CowState.Sold.valueOf())
      ));
  }
}
