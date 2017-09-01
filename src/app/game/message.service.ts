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
import { arrayToStream } from '../util/arrayToStream';
import * as _ from 'lodash';

@Injectable()
export class MessageService {
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
  public dbList: FirebaseListObservable<Message[]>;
  readonly messageStream: Observable<Message>;

  private latestList: Message[];
  private lastSeenKey: string;

  constructor(private db: AngularFireDatabase, gameID: string) {
      this.dbList = this.db.list('/messageLog/' + gameID  );
      this.latestList = [];
      this.dbList.subscribe(v => this.latestList = v);
      this.messageStream = arrayToStream(this.dbList);
  }

  public messagesSince(messageID: string) {
      return _.takeWhile(this.latestList, v => v.$key !== messageID);
  }

  public push(message: Message) {
    this.dbList.push(message);
  }
}
