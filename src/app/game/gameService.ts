import { Message, applyMessage } from './messages/Message';
import { MessageStoreService, MessageStore } from './message-store.service';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from './../game-list/game-list.service';
import { GameState, MOCK_STATE } from './../game/gameState';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject, BehaviorSubject } from 'rxjs/Rx';
import { AppliedMessage } from './AppliedMessage';

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
    public messages: Observable<AppliedMessage[]>;
    public state: Observable<GameState>;

    constructor(
        private messageStore: MessageStore,
        private game: Game
    ) {
        const self = this;
        const initial: [GameState, AppliedMessage[]] = [this.game.initialState, []];
        const applicationLog = Observable.of(initial)
        .concat(
        messageStore.messageStream.scan(
            (acc, message, index) => {
                const appliedMessage = new AppliedMessage(index, message, true, '');
                try {
                    return <[GameState, AppliedMessage[]]>[
                        applyMessage(acc[0], message),
                        [appliedMessage, ...acc[1]]
                    ];

                } catch (e) {
                    appliedMessage.successful = false;
                    appliedMessage.errorMessage = (<Error>e).message;
                    return <[GameState, AppliedMessage[]]> [acc[0], [appliedMessage, ...acc[1]]];
            }},
            initial
        ));
        this.state = applicationLog.map(v => <GameState>v[0]);
        this.messages = applicationLog.map(v => <AppliedMessage[]>v[1]);
    }


    sendMessage(message: Message) {
        this.messageStore.push(message);
    }
}
