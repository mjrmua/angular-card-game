import { Area } from './../gameState';
import { CreateAreaMessage } from './CreateAreaMessage';
import { MoveMessage } from './MoveMessage';
import { FlipMessage } from './FlipMessage';
import { ShuffleMessage } from './ShuffleMessage';
import { GameState } from '../gameState';
import * as seedrandom from "seedrandom";

export enum MessageType {
    Move, Flip, CreateArea, Shuffle
}

export type Message = CreateAreaMessage | FlipMessage | MoveMessage | ShuffleMessage;

function move(state: GameState, message: MoveMessage): GameState {
    const source = state.findArea(message.sourceID);
    const destination = state.findArea(message.destinationID);
    const card = source.findCard(message.cardID);
    return state.updateArea(message.sourceID, Area.removeCard(card))
                .updateArea(message.destinationID, Area.addCard(card, message.destinationIndex));
}

function shuffle(state: GameState, message: ShuffleMessage): GameState {
    const rng = seedrandom('', { state: state.rngState });
    state.findArea(message.areaID).shuffle(rng);
    state.rngState = rng.state();
    return state;
}

function flip(state: GameState, message: FlipMessage): GameState {
    state.findCard(message.cardID).flip();
    return state;
}

function createArea(state: GameState, message: CreateAreaMessage): GameState {
    state.areas.push(message.area);
    return state;
}

export function applyMessage(_state: GameState, message: Message) {
    const state = _state.clone();
    switch (message.type) {
        case MessageType.Move: return move(state, message);
        case MessageType.Shuffle: return shuffle(state, message);
        case MessageType.Flip: return flip(state, message);
        case MessageType.CreateArea: return createArea(state, message);
    }
}
