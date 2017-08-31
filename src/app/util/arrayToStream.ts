import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

export function arrayToStream<T>(observableArray: Observable<T[]>): Observable<T> {
      const stream = new ReplaySubject<T>();
      let lastLength = 0;
      observableArray.subscribe(v => {
          if (v.length <= lastLength) {
              return;
          }
          for (const element of v.slice(lastLength)) {
              stream.next(element);
              lastLength++;
          }
      });
      return stream;
}
