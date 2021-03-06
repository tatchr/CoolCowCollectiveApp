import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  doSearch(list, searchTerm, fieldsToSearch) {
    return list.filter(item => {
      for (var i in fieldsToSearch) {
        if (item[fieldsToSearch[i]] != null && item[fieldsToSearch[i]].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
      }
      return false;
    });
  }

  applyFilters(list, filters, field) {
    return list.filter(item => {
      for (var i in filters) {
        if (item[field] !== null && item[field].toLowerCase().indexOf(filters[i].toLowerCase()) > -1) {
          return true;
        }
      }
      return false;
    });
  }
}
