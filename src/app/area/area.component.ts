import { style } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MdDialog, MdMenuTrigger } from '@angular/material';
import { MessageService, MessageStore } from './../game/message.service';
import { GameServiceFactory } from './../game/gameService';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Area, Card, AreaStyle } from './../game/gameState';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent implements OnInit {
  @Input() area: Area;
  @Output() cardClick = new EventEmitter<Card>();
  @Output() shuffleArea = new EventEmitter<Area>();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;


  constructor(public dialog: MdDialog) {
  }

  cardID(index: number, card: Card) {
    return card.id;
  }

  getVisibleCards(): Card[] {
    if (this.area !== undefined) {
      if (this.area.style === AreaStyle.Deck && this.area.cards.length > 0) {
        return [this.area.cards[0]];
      } else {
        return this.area.cards;
      }
    }
    return [];

  }

  getCard(id: string): Card {
    return this.area.findCard(id);
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
