import { AuthService } from './../auth.service';
import { AvatarService, Avatar } from 'app/avatar/avatar.service';
import { Component, OnInit, EventEmitter, Output, } from '@angular/core';
import { User } from 'app/user/user';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User;
  avatars: Avatar[];

  constructor(avatarService: AvatarService,
    private auth: AuthService,
    private router: Router) {
    this.user = new User('', avatarService.LoadAll()[0]);
    this.avatars = avatarService.LoadAll();
   }

  setAvatar(avatar: Avatar) {
    this.user.avatar = avatar;
  }

  login() {
    this.auth.login();
  }

  ngOnInit(): void {
    this.auth.isLoggedIn.subscribe(
      v => { if (v) {
              this.router.navigate(['games']);
      }});
  }
}
