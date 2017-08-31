import { Game } from './../game-list/game-list.service';
import * as seedrandom from 'seedrandom';
import * as R from 'ramda';
import { prng } from 'seedrandom';


export class Card {
    static fromJson(json: any): Card {
        return new Card(json.id, json.faceImage, json.backImage, json.faceUp);
    }

    constructor(readonly id: string,
                readonly faceImage: string,
                readonly backImage: string,
                public faceUp: boolean = true
            ) {
        this.faceUp = faceUp;
    }

    flip() {
        this.faceUp = !this.faceUp;
    }

    clone(): Card {
        return new Card(this.id, this.faceImage, this.backImage, this.faceUp);
    }
}

export enum AreaStyle {
    Horizontal, Vertical, HorizontalStaggered, VerticalStaggered, Fan, Deck
}

export class Area {
    static flipCard = R.curry(function (cardID: string, area: Area): Area {
        const card = area.cards.filter(v => v.id === cardID)[0];
        const index = area.cards.indexOf(card);
        const flipped = new Card(card.id, card.faceImage, card.backImage, !card.faceUp);
        return R.pipe(
            Area.removeCard(card),
            Area.addCard(flipped, index)
        )(area);
    });

    static addCard = R.curry(function (card: Card, index: number, area: Area): Area {
        if (index < 0) {
            index = area.cards.length + 1 + index;
        }

        if (index > area.cards.length) {
            throw new Error('Index out of range');
        }
        if (index === -1) {
            return new Area(area.id, area.name, area.style, area.parentID, [...area.cards, card]);
        }
        return new Area(area.id, area.name, area.style, area.parentID,
            [...area.cards.slice(0, index), card, ...area.cards.slice(index)]);
    });

    static removeCard = R.curry(function (card: Card, area: Area): Area {
        const index = area.cards.indexOf(card);
        return new Area(area.id, area.name, area.style, area.parentID,
            [...area.cards.slice(0, index), ...area.cards.slice(index + 1)]);
    });

    static named(id: string) {
        return new Area(id, id, AreaStyle.Horizontal, null, []);
    }
    static fromJson(json: Area): Area {
        return new Area(json.id, json.name, json.style, json.parentID, (json.cards || []).map(Card.fromJson));
    }

    constructor(readonly id: string,
                readonly name: string,
                readonly style: AreaStyle,
                readonly parentID: string,
                readonly cards: Card[]) {
    }

    hasCard(id: string): boolean  {
        const card = this.cards.find(v => v.id === id);
        return card !== undefined;
    }

    findCard(id: string): Card {
        const card = this.cards.find(v => v.id === id);
        if (card === undefined) {
            throw new Error('Card ' + id + ' not found');
        }
        return card;
    }
    shuffle(rng: prng) {
        console.log(rng.quick());
        for (let i = this.cards.length; i; i--) {
            const j = Math.floor(rng.quick() * i);
            [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
        }
    }
    clone(): Area {
        return new Area(this.id, this.name, this.style, this.parentID, this.cards.map(v => v.clone()));
    }
}

export class GameState {
    static fromJson(json: GameState): GameState {
        return new GameState(json.rngState, json.areas.map(Area.fromJson));
    }

    with(area: Area): GameState {
        return new GameState(this.rngState, [...this.areas, area]);
    }

    flipCard(cardID: string): GameState {
        const areaID = this.areaWithCard(cardID).id;
        return this.updateArea(areaID, Area.flipCard(cardID));
    }

    constructor(public rngState: any, readonly areas: Area[]) { }

    playerAreas(player: string): Area[] {
        return this.areas.filter(v => v.parentID === player);
    }

    commonAreas(): Area[] {
        return this.areas.filter(v => !v.parentID);
    }

    areaWithCard(cardID: string): Area {
        const area = this.areas.find(v => v.hasCard(cardID));
        if (area === undefined) {
            throw Error('Card ' + cardID + ' not found');
        }
        return area;
    }

    findCard(cardID: string): Card {
        for (const area of this.areas) {
            const card = area.findCard(cardID);
            if (card !== undefined) {
                return card;
            }
        }
        throw Error('Card ' + cardID + ' not found');
    }
    updateArea(areaID: string, change: (a: Area) => Area): GameState {
        const oldArea = this.areas.find(v => v.id === areaID);
        const index = this.areas.indexOf(oldArea);
        const newAreas = [
            ...this.areas.slice(0, index),
            change(oldArea),
            ...this.areas.slice(index + 1)
        ];
        return new GameState(this.rngState, newAreas);
    }

    findArea(id: string): Area {
        const result = this.areas.find(v => v.id === id);
        if (result === undefined) {
             throw new Error('Area ' + id + ' not found');
        }
        return result;
    }

    cardsIn(id: string): string[] {
        return this.findArea(id).cards.map(v => v.id);
    }

    clone(): GameState {
        return new GameState(this.rngState, this.areas.map(v => v.clone()));
    }
}

const RNG_STATE = seedrandom('', { state: true }).state();

export const EMPTY_STATE = new GameState(RNG_STATE, []);

export const MOCK_STATE = new GameState(RNG_STATE,
    [
        new Area('Horizontal', 'Horizontal', AreaStyle.Horizontal, 'Player 1',
            [
                new Card('1', 'http://dominion.diehrstraits.com/scans/base/cellar.jpg',                         'https://c1.staticflickr.com/4/3376/3427375948_430ac7e8da.jpg', false),
                new Card('2', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Playing_card_spade_2.svg',   'https://c1.staticflickr.com/4/3376/3427375948_430ac7e8da.jpg', true),
                new Card('3', 'https://a.fsdn.com/con/app/proj/vector-cards/screenshots/QS.png/1',              'https://c1.staticflickr.com/4/3376/3427375948_430ac7e8da.jpg'),
                new Card('4', 'http://gwentify.com/wp-content/uploads/2017/06/113208_Aeromancy_art0-500x617.png', 'https://c1.staticflickr.com/4/3376/3427375948_430ac7e8da.jpg'),
            ]
        ),
        new Area('Horizontal Staggered', 'Horizontal-Staggered', AreaStyle.HorizontalStaggered, 'Player 2',
            [
                new Card('5', 'https://s-media-cache-ak0.pinimg.com/736x/02/2d/f9/022df9c11dd13dff9dcb519288a4d9d6--deck-of-cards-magic-the-gathering-cards.jpg', 'https://i.ebayimg.com/thumbs/images/g/TO0AAOSwnNBXZ~eF/s-l225.jpg'),
                new Card('6', 'https://store.tcgplayer.com/images/zd/nm_mtg_2.jpg', 'https://i.ebayimg.com/thumbs/images/g/TO0AAOSwnNBXZ~eF/s-l225.jpg'),
                new Card('7', 'https://upload.wikimedia.org/wikipedia/en/8/85/Black_lotus.jpg', 'https://i.ebayimg.com/thumbs/images/g/TO0AAOSwnNBXZ~eF/s-l225.jpg'),
                new Card('8', 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=370735&type=card', 'https://i.ebayimg.com/thumbs/images/g/TO0AAOSwnNBXZ~eF/s-l225.jpg'),
            ]
        ),
        new Area('Fan', 'Fan', AreaStyle.Fan, null,
            [
                new Card('9', 'https://www.acoo.net/uploads/2015/04/Netrunner-research-grant-.png', 'https://vignette3.wikia.nocookie.net/ancur/images/c/c3/Corp_back.png/revision/latest?cb=20150128082205'),
                new Card('a', 'https://www.acoo.net/uploads/2016/01/Netrunner-advanced-concept-hopper-.png', 'https://vignette3.wikia.nocookie.net/ancur/images/c/c3/Corp_back.png/revision/latest?cb=20150128082205'),
                new Card('b', 'https://www.acoo.net/uploads/2017/05/Netrunner-successful-field-test-.png', 'https://vignette3.wikia.nocookie.net/ancur/images/c/c3/Corp_back.png/revision/latest?cb=20150128082205'),
                new Card('c', 'https://www.acoo.net/uploads/2013/05/AN-muresh-bodysuit.png', 'https://vignette3.wikia.nocookie.net/ancur/images/c/c3/Corp_back.png/revision/latest?cb=20150128082205'),
            ]
        )
    ]);
