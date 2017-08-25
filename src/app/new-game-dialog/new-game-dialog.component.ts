import { MOCK_STATE, GameState } from './../game/gameState';
import { Router } from '@angular/router';
import { GameListService } from './../game-list/game-list.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss']
})
export class NewGameDialogComponent implements OnInit {
  public name: string;
  public defaultStateJson: string = JSON.stringify(MOCK_STATE, null, 2);


  constructor(private service: GameListService, private router: Router) { }

  ngOnInit() {
  }

  create() {
    const id = this.service
      .new(this.name, GameState.fromJson(JSON.parse(this.defaultStateJson)));
    this.router.navigate(['game', id]);
  }

}

