import { GameState } from './../gameState';
import { MessageType, Message } from './Message';

export class MoveMessage {
    type: MessageType.Move;
    $key: string;
    constructor(readonly cardID: string,
                readonly sourceID: string,
                readonly destinationID: string,
                readonly destinationIndex: number) {
                this.type = MessageType.Move;
                }

}
