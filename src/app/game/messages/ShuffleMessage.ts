import { Message, MessageType } from './Message';
import { GameState } from './../gameState';
import * as seedrandom from "seedrandom";

export class ShuffleMessage {
    type: MessageType.Shuffle = MessageType.Shuffle;
    $key: string;
    constructor(readonly areaID: string) {
        this.type = MessageType.Shuffle;
    }
}
