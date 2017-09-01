import { VisibleCardsPipe } from './visible-cards.pipe';
import { style } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MdDialog, MdMenuTrigger } from '@angular/material';
import { MessageService, MessageStore } from './../game/message.service';
import { GameServiceFactory } from './../game/gameService';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Area, Card, AreaStyle } from './../game/gameState';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @Input() area: Area;
  @Output() cardClick = new EventEmitter<Card>();
  @Output() shuffleArea = new EventEmitter<Area>();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  visibleCards: Card[];

  constructor(public dialog: MdDialog) {
    if (this.area !== undefined) {
      if (this.area.style === AreaStyle.Deck && this.area.cards.length > 0) {
        this.visibleCards = [this.area.cards[0]];
      } else {
        this.visibleCards = this.area.cards;
      }
    }
  }

  ngOnInit() {
  }

  fireCardClick(card: Card) {
    this.cardClick.emit(card);
  }

  openAreaMenu() {
    this.trigger.openMenu();
  }

  fireShuffleEvent() {
    this.shuffleArea.emit(this.area);
  }

}
