import { Subject } from 'rxjs/Rx';
import { TestBed, async } from '@angular/core/testing';
import { arrayToStream } from './arrayToStream';
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';

describe('ArrayToStream', () => {
  beforeEach(async(() => { }));

  it('should stream each element in the input array', fakeAsync(() => {
     const source = new Subject<number[]>();
     const stream = arrayToStream(source);
     const output = [];
     stream.subscribe(output.push);
     source.next([1, 2, 3]);
     tick();
     expect(output).toEqual([1, 2, 3]);
  }));
});
