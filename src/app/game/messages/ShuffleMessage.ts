import { Message, MessageType } from './Message';
import { GameState } from './../gameState';
import * as seedrandom from "seedrandom";

export class ShuffleMessage implements Message {
    type: MessageType = MessageType.Shuffle;
    $key: string;
    constructor(readonly areaID: string) {
    }

    apply(state: GameState): GameState {
        const rng = seedrandom('', { state: state.rngState });
        state.findArea(this.areaID).shuffle(rng);
        state.rngState = rng.state();
        return state;
    }
}
