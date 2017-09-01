import { GameServiceFactory } from './game/gameService';
import { MessageService } from './game/message.service';
import { AuthGuard } from './user/auth.guard';
import { AuthService } from './user/auth.service';
import { CardViewComponent } from 'app/card-view/card-view.component';
import { GameListService } from './game-list/game-list.service';
import { AvatarService } from 'app/avatar/avatar.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';

import { FormsModule } from '@angular/forms';

import { RouterModule, Routes, ActivatedRoute } from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {  MdSelectModule, MdToolbarModule,
          MdCardModule, MdInputModule, MdButtonModule,
          MdMenuModule, MdDialogModule, MdTabsModule, MdCheckboxModule, MdIconModule
} from '@angular/material';
import { AvatarComponent } from './avatar/avatar.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameViewComponent } from './game-view/game-view.component';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';

import { CardStylePipe } from './area/card-style.pipe';
import { VisibleCardsPipe } from './area/visible-cards.pipe';
import { JsonPipe, CommonModule } from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MessageLogComponent } from './message-log/message-log.component';
import { AddAreaDialogComponent } from './add-area-dialog/add-area-dialog.component';
import { AreaComponent } from './area/area.component';
import * as seedrandom from "seedrandom";
import { MdTooltipModule, MdSnackBarModule } from '@angular/material';
import { CardComponent } from './card/card.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'game/:id', component: GameViewComponent, canActivate: [AuthGuard] },
  { path: 'game/:id/log', component: MessageLogComponent, canActivate: [AuthGuard] },
  { path: 'games', component: GameListComponent,   canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent }
];

@NgModule({
  declarations: [
    CardViewComponent,
    AppComponent,
    LoginComponent,
    AvatarComponent,
    GameListComponent,
    GameViewComponent,
    CardStylePipe,
    VisibleCardsPipe,
    NewGameDialogComponent,
    MessageLogComponent,
    AddAreaDialogComponent,
    AreaComponent,
    CardComponent
  ],
  imports: [
     RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MdSelectModule,
    MdCheckboxModule,
    MdToolbarModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdMenuModule,
    MdDialogModule,
    MdTabsModule,
    FormsModule,
    DragulaModule,
    MdMenuModule,
    CommonModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
     AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdIconModule,
    MdMenuModule,
    MdTooltipModule,
    MdSnackBarModule
  ],
  providers: [  AvatarService,
                GameListService,
                GameServiceFactory,
                AuthService,
                AuthGuard,
                MessageService
              ],
  bootstrap: [ AppComponent ],
  entryComponents: [CardViewComponent, NewGameDialogComponent, AddAreaDialogComponent]
})
export class AppModule { }
