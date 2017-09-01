import { AngularFireAuth } from 'angularfire2/auth';
import { MOCK_STATE, Card } from './game/gameState';
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
  cards: Card[];

  constructor(public auth: AuthService) {
    this.cards = MOCK_STATE.areas[0].cards;
  }

  onClick(card: Card) {
    card.flip();
/*
    this.cards = this.cards.map(
      v => (v !== card)
      ? v
      : new Card(card.id,
      card.faceImage,
      card.backImage,
      !card.faceUp
    ));
    */
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
