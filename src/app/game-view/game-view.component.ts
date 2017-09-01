import { AppliedMessage } from './../game/AppliedMessage';
import { ShuffleMessage } from './../game/messages/ShuffleMessage';
import { AddAreaDialogComponent } from './../add-area-dialog/add-area-dialog.component';
import { Message } from './../game/messages/Message';
import { Observable } from 'rxjs/Observable';
import { MessageService, MessageStore } from './../game/message.service';
import { JsonPipe } from '@angular/common';
import { MOCK_STATE, Area, Card, GameState } from './../game/gameState';
import { GameServiceFactory, GameService } from './../game/gameService';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdTab } from '@angular/material';
import { MoveMessage } from '../game/messages/MoveMessage';
import { CardViewComponent } from "../card-view/card-view.component";

function log(a: any): any {
  console.log(a);
  return a;
}
@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  id: string;
  public seats: string[] = ['Player 1', 'Player 2', 'Player 3'];
  public state: Observable<GameState>;
  public service: GameService;
  private messageStore: MessageStore;

  constructor(private route: ActivatedRoute,
              private dragulaService: DragulaService,
              private gameServiceFactory: GameServiceFactory,
              private MessageService: MessageService,
              public dialog: MdDialog
            ) {
  }

  getStyle(card: Card, index: Number): String {
    return 'background-image: url(' + card.faceImage + ');';
  }

  addArea(parent: string) {
    this.dialog.open(AddAreaDialogComponent, { data: { parent: parent, messageStore: this.messageStore } });
  }

  openCardView(card: Card) {
     this.dialog.open(CardViewComponent, { data: { card: card, messageStore: this.messageStore } });
  }

  shuffle(area: Area) {
    this.messageStore.push(new ShuffleMessage(area.id));
  }

  viewAtRevision(message: AppliedMessage) {
    this.service.viewAtMesage(message.message.$key);
  }

  private onDrop(args) {
    const [card, destination, source, sibling] = args;
    const cardID = card.getAttribute('data-card-id');
    const areaID = destination.getAttribute('data-area-id');
    const sourceID = source.getAttribute('data-area-id');
    const siblingID = sibling === null
      ? '0'
      : sibling.getAttribute('data-card-id');
    const index = sibling === null
                  ? -1
                  : sibling.getAttribute('data-card-index');

    this.messageStore.push(new MoveMessage(cardID, sourceID, areaID, index));
  }


  ngOnInit() {
    this.dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });

   this.route.paramMap.first().toPromise()
   .then(map => this.id = map.get('id'))
   .then(id => {
      this.messageStore = this.MessageService.loadMessageStore(id);
      return this.gameServiceFactory.load(this.id);
    })
   .then(service => {
     this.service = service;
     this.state = service.selectedState; })
   .catch(log);
  }
}
