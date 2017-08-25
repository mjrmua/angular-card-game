import { Component, OnInit, Input } from '@angular/core';
import { Avatar } from 'app/avatar/avatar.service';

@Component({
  selector: 'app-avatar',
  template: '<img style="width: 40px;" [src]="avatar.imageUrl"/>',
})
export class AvatarComponent implements OnInit {
  @Input() avatar: Avatar;
  constructor() { }

  ngOnInit() {
  }

}
