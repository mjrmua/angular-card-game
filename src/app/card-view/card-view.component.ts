import { FlipMessage } from './../game/messages/FlipMessage';
import { MessageStore } from './../game/message.service';
import { Card } from './../game/gameState';
import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { MD_DIALOG_DATA, MdMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent implements OnInit {

  card: Card;
  messageStore: MessageStore;
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any
) {
    this.card = data.card as Card;
    this.messageStore = data.messageStore as MessageStore;
  }

  ngOnInit() {
  }

  flip() {
    this.messageStore.push(new FlipMessage(this.card.id));
  }

  openMenu() {
    this.trigger.openMenu();
  }
}
