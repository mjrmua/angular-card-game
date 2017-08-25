import { MoveMessage } from './../game/messages/MoveMessage';
import { Message, MessageType } from './../game/messages/Message';
import { ActivatedRoute } from '@angular/router';
import { MessageStoreService } from './../game/message-store.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.scss']
})
export class MessageLogComponent implements OnInit {
  public messages: Message[];

  constructor(private storeFactory: MessageStoreService, private route: ActivatedRoute) {
    this.messages = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        const store = this.storeFactory.loadMessageStore(id);
        store.messageStream.subscribe(v => this.messages.splice(0, 0, v));
      });
  }

  messageDescription(message: Message): string {
    if (message.type === MessageType.Move) {
      const move = <MoveMessage>message;
      return `Move ${move.cardID} from ${move.sourceID} ${move.destinationID}`;
    }
    return 'Flip';
  }
}
