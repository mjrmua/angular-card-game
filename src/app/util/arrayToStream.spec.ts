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
     stream.subscribe(v => output.push(v));
     source.next([1, 2, 3]);
     tick();
     expect(output).toEqual([1, 2, 3]);
  }));

  it('should replay previous entries', fakeAsync(() => {
     const source = new Subject<number[]>();
     const stream = arrayToStream(source);
     const output = [];
     source.next([1, 2, 3]);
     stream.subscribe(v => output.push(v));
     tick();
     expect(output).toEqual([1, 2, 3]);
  }));

  it('should stream new elements added to the array', fakeAsync(() => {
     const source = new Subject<number[]>();
     const stream = arrayToStream(source);
     const output = [];
     stream.subscribe(v => output.push(v));
     source.next([1, 2, 3]);
     source.next([1, 2, 3, 4]);
     tick();
     expect(output).toEqual([1, 2, 3, 4]);
  }));

  it('should throw any error if you do a non-push modification', fakeAsync(() => {
     const source = new Subject<number[]>();
     const stream = arrayToStream(source);
     const output = [];
     stream.subscribe(v => output.push(v));
     source.next([1, 2, 3]);
     source.next([5]);
     tick();
  }));
});
