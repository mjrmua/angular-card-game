import { Injectable } from '@angular/core';

export class Avatar {
  constructor(public imageUrl: string) {
  }
}

@Injectable()
export class AvatarService {

  constructor() { }

  LoadAll(): Avatar[] {
    return [
      'boy', 'boy-1', 'girl', 'girl-1', 'man', 'man-1', 'man-2', 'man-3', 'man-4'
    ].map(v => '/assets/avatars/' + v + '.svg')
     .map(v => new Avatar(v));
    ;
  }

}
