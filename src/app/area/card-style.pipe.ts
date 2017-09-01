import { Card, Area, AreaStyle } from './../game/gameState';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardStyle'
})
export class CardStylePipe implements PipeTransform {
  transform(value: Card, index: number, area: Area): object {
    switch (area.style) {
      case AreaStyle.Fan: return this.fan(value, index, area);
      case AreaStyle.Deck:
      case AreaStyle.Horizontal: return this.horizontal(value, index, area);
      case AreaStyle.HorizontalStaggered: return this.horizontalStaggered(value, index, area);
    }
    const transX = -50;
    const transform = index === 0 ? '0px' : transX + 'px';
    const rotation = 5 * (index - area.cards.length / 2);
    return {
      'margin-left': transform,
      'transform': 'rotate(' + rotation + 'deg)'
        };
  };
  fan(value: Card, index: number, area: Area): object {
    const transX = -50;
    const transform = index === 0 ? '0px' : transX + 'px';
    const rotation = 5 * (index - area.cards.length / 2);
    const margin = 5 * Math.abs(index - area.cards.length / 2);
    return {
      'margin-left': transform,
      'margin-top': margin + 'px',
      'transform': 'rotate(' + rotation + 'deg)'
        };
  };

  horizontal(value: Card, index: number, area: Area): object {
     const image =  value.faceUp ? value.faceImage : value.backImage;
    return {
      'margin-left': (index > 0 ? '10' : '0') + 'px'
        };
  };

  horizontalStaggered(value: Card, index: number, area: Area): object {
    const transX = -50;
    const transform = index === 0 ? '0px' : transX + 'px';
    return {
      'margin-left': transform
        };
  };
}
