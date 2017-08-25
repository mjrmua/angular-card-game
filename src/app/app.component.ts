import { AngularFireAuth } from 'angularfire2/auth';
import { MOCK_STATE } from './game/gameState';
import { AuthService } from './user/auth.service';
import { Observable } from 'rxjs/Observable';
import { Game } from './game-list/game-list.service';
import { LoginComponent } from './user/login/login.component';
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(public auth: AuthService) {
  }

  add() {
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

}
