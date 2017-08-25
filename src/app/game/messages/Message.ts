import { GameState } from '../gameState';

export enum MessageType {
    Move, Flip, CreateArea, Shuffle
}

export interface Message {
    type: MessageType;
    $key: string;
    apply(state: GameState): GameState;
}
