import { AppliedMessage } from './../game/AppliedMessage';
import { GameService } from './../game/gameService';
import { MoveMessage } from './../game/messages/MoveMessage';
import { Message, MessageType } from './../game/messages/Message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from './../game/message.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.scss']
})
export class MessageLogComponent implements OnInit {
  @Input() service: GameService;
  @Output() viewAtRevisionClick = new EventEmitter<AppliedMessage>();

  constructor() {
  }

  ngOnInit() {
  }

  messageDescription(message: Message): string {
    if (message.type === MessageType.Move) {
      const move = <MoveMessage>message;
      return `Move ${move.cardID} from ${move.sourceID} to ${move.destinationID} index ${move.destinationIndex}`;
    }
    return 'Flip ';
  }

  viewAtRevision(message: AppliedMessage) {
    this.viewAtRevisionClick.emit(message);
  }
}
