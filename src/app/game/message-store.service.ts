import { ShuffleMessage } from './messages/ShuffleMessage';
import { CreateAreaMessage } from './messages/CreateAreaMessage';
import { Area } from './gameState';
import { FlipMessage } from './messages/FlipMessage';
import { Message, MessageType } from './messages/Message';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MoveMessage } from './messages/MoveMessage';

@Injectable()
export class MessageStoreService {
  constructor(private db: AngularFireDatabase) {
  }

  loadMessageStore(gameID: string) {
    return new MessageStore(this.db, gameID);
  }
}

function messageFromJson(json: any): Message {
    let message: Message;
    switch (json.type) {
        case MessageType.Move:
            message = new MoveMessage(json.cardID,
                    json.sourceID,
                    json.destinationID,
                    json.destinationIndex
                );
        break;
        case MessageType.CreateArea:
        message = new CreateAreaMessage(Area.fromJson(json.area));
        break;
        case MessageType.Flip:
            message = new FlipMessage(json.cardID);
        break;
        case MessageType.Shuffle:
                message = new ShuffleMessage(json.areaID);
        break;
    }
    message.$key = json.$key;
    return message;
}

export class MessageStore {
  readonly messageStream: ReplaySubject<Message>;
  private dbList: FirebaseListObservable<Message[]>;
  private lastSeenKey: string;
  public latestMessage: Observable<Message>;

  constructor(private db: AngularFireDatabase, gameID: string) {
      this.dbList = this.db.list('/messageLog/' + gameID  );
      this.messageStream = new ReplaySubject<Message>();
      this.latestMessage = this.messageStream.map(v => v);
      this.dbList.subscribe(this.loadNewMessages.bind(this));
  }

  public push(message: Message) {
    this.dbList.push(message);
  }

  private loadNewMessages(messages: Message[]) {
    if (this.lastSeenKey === undefined) {
      for (const message of messages) {
        this.messageStream.next(messageFromJson(message));
        this.lastSeenKey = message.$key;
      }
    } else {
      let isNew = false;
      for (const message of messages) {
        if (isNew) {
          this.lastSeenKey = message.$key;
          this.messageStream.next(messageFromJson(message));
        }
        if (message.$key === this.lastSeenKey) {
          isNew = true;
        }
      }
    }
  }
}
