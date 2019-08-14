import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  filterItems(items, searchTerm, fieldsToSearch) {
    return items.filter(item => {      
      for(var i in fieldsToSearch){
        if(item[fieldsToSearch[i]] !== null 
          && item[fieldsToSearch[i]].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ){
          return true;
        }        
      }   
      return false;
    });
  }
}
