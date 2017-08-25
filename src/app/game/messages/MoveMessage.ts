import { GameState } from './../gameState';
import { MessageType, Message } from './Message';

export class MoveMessage implements Message {
    type: MessageType = MessageType.Move;
    $key: string;
    constructor(readonly cardID: string,
                readonly sourceID: string,
                readonly destinationID: string,
                readonly destinationIndex: number) {}

    apply(state: GameState): GameState {
        const source = state.findArea(this.sourceID);
        const card = source.findCard(this.cardID);
        source.removeCard(card);

        const destination = state.findArea(this.destinationID);
        destination.addCard(card, this.destinationIndex);
        return state;
    }
}
