import { CreateAreaMessage } from './../game/messages/CreateAreaMessage';
import { MessageStore } from './../game/message.service';
import { MD_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { AreaStyle, Area } from "../game/gameState";

@Component({
  selector: 'app-add-area-dialog',
  templateUrl: './add-area-dialog.component.html',
  styleUrls: ['./add-area-dialog.component.scss']
})
export class AddAreaDialogComponent implements OnInit {
  parent: string;
  messageStore: MessageStore;
  allSeats: boolean;
  name: string;
  layouts: any[] = [
    {name: 'Fan',        value: <number>AreaStyle.Fan },
    {name: 'Horizontal', value: AreaStyle.Horizontal },
    {name: 'Horizontal Staggered', value: AreaStyle.HorizontalStaggered},
    {name: 'Vertical', value: AreaStyle.Vertical},
    {name: 'Vertical Staggered', value: AreaStyle.Vertical},
    {name: 'Deck', value: AreaStyle.Deck},
  ];
  layout: number;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    this.parent = data.parent;
    this.messageStore = data.messageStore as MessageStore;
  }

  ngOnInit() {
  }

  create() {
    const area = new Area(this.name, this.name, this.layout, this.parent, []);
    this.messageStore.push(new CreateAreaMessage(area));
  }

}
