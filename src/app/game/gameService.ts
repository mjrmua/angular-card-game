import { Message, applyMessage } from './messages/Message';
import { MessageStoreService, MessageStore } from './message-store.service';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from './../game-list/game-list.service';
import { GameState, MOCK_STATE } from './../game/gameState';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GameServiceFactory {
    constructor(
        private db: AngularFireDatabase,
        private messageStoreFactory: MessageStoreService
    ) {}

    load(gameID: string): Promise<GameService> {
        return this.db.object('/games/' + gameID)
            .map(Game.fromJson)
            .map(game => new GameService(
                             this.messageStoreFactory.loadMessageStore(gameID),
                             game))
            .first()
            .toPromise();
    }
}

export class GameService {
    public state: Observable<GameState>;
    private s: GameState;

    constructor(
        private messageStore: MessageStore,
        private game: Game
    ) {
        this.s = this.game.initialState;
        const self = this;
        console.log('gameService constructor');
        this.state = Observable.of(this.game.initialState)
        .concat(
        messageStore.messageStream.scan(
            (state, message, index) => {
                return applyMessage(state, message);
            },
            game.initialState
        ));
    }


    sendMessage(message: Message) {
        this.messageStore.push(message);
    }
}
