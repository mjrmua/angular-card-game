import { Message, MessageType } from './Message';
import { GameState } from './../gameState';

export class FlipMessage implements Message {
    type: MessageType = MessageType.Flip;
    $key: string;
    constructor(readonly cardID: string) {
    }

    apply(state: GameState): GameState {
        state.findCard(this.cardID).flip();
        return state;
    }
}
