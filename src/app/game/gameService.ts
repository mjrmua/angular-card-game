import { Message, applyMessage } from './messages/Message';
import { MessageService, MessageStore } from './message.service';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from './../game-list/game-list.service';
import { GameState, MOCK_STATE } from './../game/gameState';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject, BehaviorSubject } from 'rxjs/Rx';
import { AppliedMessage } from './AppliedMessage';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class GameServiceFactory {
    constructor(
        private db: AngularFireDatabase,
        private messageStoreFactory: MessageService,
        private snackBar: MdSnackBar
    ) {}

    load(gameID: string): Promise<GameService> {
        return this.db.object('/games/' + gameID)
            .map(Game.fromJson)
            .map(game => new GameService(
                             this.messageStoreFactory.loadMessageStore(gameID),
                             game,
                             this.snackBar))
            .first()
            .toPromise();
    }
}


export class GameService {
    public messages: Observable<AppliedMessage[]>;
    public selectedState: BehaviorSubject<GameState>;
    public selectedMessageKey: BehaviorSubject<string> = new BehaviorSubject(null);
    private latestState: BehaviorSubject<GameState>;

    constructor(
        private messageStore: MessageStore,
        private game: Game,
        public snackBar: MdSnackBar
    ) {
        const self = this;
        const initial: [GameState, AppliedMessage[]] = [this.game.initialState, []];
        this.selectedState = new BehaviorSubject<GameState>(this.game.initialState);
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
        this.latestState = new BehaviorSubject(this.game.initialState);
        applicationLog.map(v => <GameState>v[0]).subscribe(this.latestState);

        this.messages = applicationLog.map(v => <AppliedMessage[]>v[1]);

        this.latestState.subscribe(v => {
            if (this.selectedMessageKey.getValue() === null) {
                this.selectedState.next(v);
            }
        });

        this.selectedMessageKey.subscribe(v => {
            if (v === null) {
                this.selectedState.next(this.latestState.getValue());
            } else {
                const messages = this.messageStore.messagesSince(v);
                const state = messages.reduce((acc, msg) => {
                    return applyMessage(acc, msg);
                }, this.game.initialState);
                this.selectedState.next(state
                );
            }
        });
    }

    viewAtMesage(mesageKey: string) {
        this.selectedMessageKey.next(mesageKey);
        this.snackBar
            .open('viewing old version', 'go to latest')
            .afterDismissed()
            .subscribe(v => this.viewCurrent());
    }

    viewCurrent() {
        debugger;
        console.log('viewing latest');
        this.selectedMessageKey.next(null);
    }

    sendMessage(message: Message) {
        this.messageStore.push(message);
    }
}
