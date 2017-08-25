import { Message, MessageType } from './Message';
import { GameState, Area } from './../gameState';

export class CreateAreaMessage implements Message {
    type: MessageType = MessageType.CreateArea;
    $key: string;
    constructor(readonly area: Area) {
    }

    apply(state: GameState): GameState {
        state.areas.push(this.area);
        return state;
    }
}

