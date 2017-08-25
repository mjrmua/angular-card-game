import { Message, MessageType } from './Message';
import { GameState, Area } from './../gameState';

export class CreateAreaMessage {
    type: MessageType.CreateArea;
    $key: string;
    constructor(readonly area: Area) {
    }
}

