import { GameState, MOCK_STATE } from './../game/gameState';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Avatar, AvatarService } from './../avatar/avatar.service';
import { User } from './../user/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

export class Game {
  public $key: string;
  constructor(
    readonly name: String,
    readonly initialState: GameState,
  ) {}

  public static fromJson(json: Game) {
    const game = new Game(json.name, GameState.fromJson(json.initialState));
    game.$key = json.$key;
    return game;
  }

}
@Injectable()
export class GameListService {
  items: FirebaseListObservable<any>;

  constructor(private db: AngularFireDatabase) {
    this.items = db.list('/games');
    }

  new(name: string, initialState: GameState): string {
    return this.items.push(new Game(name, initialState)).key;
  }

  delete(game: Game) {
    this.items.remove(game.$key);
  }
}
