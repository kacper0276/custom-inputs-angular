import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  getData(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const fetchedData = {
          inputValue: 'Zaktualizowana wartość z backendu',
          placeholder: 'Wprowadź dane',
        };
        observer.next(fetchedData);
        observer.complete();
      }, 2000);
    });
  }
}
