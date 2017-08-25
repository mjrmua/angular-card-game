import { Message, MessageType } from './Message';
import { GameState } from './../gameState';

export class FlipMessage {
    type: MessageType.Flip;
    $key: string;
    constructor(readonly cardID: string) {
    }

}
