import { EMPTY_STATE, Card, Area, AreaStyle } from './gameState';
import { TestBed, async } from '@angular/core/testing';
import { MoveMessage } from './messages/MoveMessage';
import { applyMessage } from './messages/Message';

function areaWithCards(area: string, cards: string[]) {
  return new Area(area, area, AreaStyle.Fan, null, cards.map(v => new Card(v, '', '', true)));

}

describe('GameState', () => {
  beforeEach(async(() => {
  }));

  describe('Empty state', () => {
    it('should should have no areas', () => {
      expect(EMPTY_STATE.areas).toEqual([]);
    });

    describe('Move action', () => {
      it('should throw an exception if source area is not found', () => {
        const move = new MoveMessage('card', 'source', 'dest', 2);
        expect(() => applyMessage(EMPTY_STATE, move)).toThrow(new Error('Area source not found'));
      });

      it('should throw an exception if desination area is not found', () => {
        const move = new MoveMessage('card', 'source', 'dest', 2);
        const state = EMPTY_STATE.with(Area.named('source'));

        expect(() => applyMessage(state, move)).toThrow(new Error('Area dest not found'));
      });

      it('should throw an exception if card is missing', () => {
        const move = new MoveMessage('card', 'source', 'dest', 2);
        const state = EMPTY_STATE.with(Area.named('source'))
                                .with(Area.named('dest'));
        expect(() => applyMessage(state, move)).toThrow(new Error('Card card not found'));
      });

      it('should throw an exception if index is out of range', () => {
        const move = new MoveMessage('card', 'source', 'dest', 1);
        const state = EMPTY_STATE.with(areaWithCards('source', ['card']))
                                .with(Area.named('dest'));
        expect(() => applyMessage(state, move)).toThrow(new Error('Index out of range'));
      });

      it('should move a card between areas', () => {
        const move = new MoveMessage('card', 'source', 'dest', 0);
        const state = EMPTY_STATE.with(areaWithCards('source', ['card']))
                                 .with(Area.named('dest'));

        const newState = applyMessage(state, move);
        expect(newState.cardsIn('source')).toEqual([]);
        expect(newState.cardsIn('dest')).toEqual(['card']);
      });

      it('should insert at destination index', () => {
        const state = EMPTY_STATE.with(areaWithCards('source', ['card']))
                                 .with(areaWithCards('dest', ['1', '2', '3']));
        const moveCardTo = index => applyMessage(state, new MoveMessage('card', 'source', 'dest', index));

        expect(moveCardTo(0).cardsIn('dest')).toEqual(['card', '1', '2', '3']);
        expect(moveCardTo(1).cardsIn('dest')).toEqual(['1', 'card', '2', '3']);
        expect(moveCardTo(3).cardsIn('dest')).toEqual(['1', '2', '3', 'card']);

        // Negative indexing
        expect(moveCardTo(-1).cardsIn('dest')).toEqual(['1', '2', '3', 'card']);
        expect(moveCardTo(-2).cardsIn('dest')).toEqual(['1', '2', 'card', '3']);
        expect(moveCardTo(-3).cardsIn('dest')).toEqual(['1', 'card', '2', '3']);
        expect(moveCardTo(-4).cardsIn('dest')).toEqual(['card', '1', '2', '3']);
      });

      it('should allow moving to source', () => {
        const state = EMPTY_STATE.with(areaWithCards('dest', ['1', 'card', '2', '3']));
        const moveCardTo = index => applyMessage(state, new MoveMessage('card', 'dest', 'dest', index));

        expect(moveCardTo(0).cardsIn('dest')).toEqual(['card', '1', '2', '3']);
        expect(moveCardTo(1).cardsIn('dest')).toEqual(['1', 'card', '2', '3']);
        expect(moveCardTo(2).cardsIn('dest')).toEqual(['1', '2', 'card', '3']);
        expect(moveCardTo(3).cardsIn('dest')).toEqual(['1', '2', '3', 'card']);

        // Negative indexing
        expect(moveCardTo(-1).cardsIn('dest')).toEqual(['1', '2', '3', 'card']);
        expect(moveCardTo(-2).cardsIn('dest')).toEqual(['1', '2', 'card', '3']);
        expect(moveCardTo(-3).cardsIn('dest')).toEqual(['1', 'card', '2', '3']);
        expect(moveCardTo(-4).cardsIn('dest')).toEqual(['card', '1', '2', '3']);
      });
    });
  });
});

