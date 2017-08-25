import { NewGameDialogComponent } from './../new-game-dialog/new-game-dialog.component';
import { MdDialog, MdButton } from '@angular/material';
import { Router } from '@angular/router';
import { Game} from './game-list.service';
import { GameListService} from './game-list.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  games: any[];

  constructor(private gameService: GameListService,
    private router: Router,
    public dialog: MdDialog
  ) {
    gameService.items.subscribe(v => this.games = v);
  }


  ngOnInit() { }

  joinGame(game: Game) {
    this.router.navigate(['game/' + game.$key]);
  }

  newGame() {
    this.dialog.open(NewGameDialogComponent);
  }

  delete(game: Game) {
    this.gameService.delete(game);
  }

}
