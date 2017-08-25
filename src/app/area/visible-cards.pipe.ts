import { Card, Area, AreaStyle } from './../game/gameState';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'visibleCards'
})
export class VisibleCardsPipe implements PipeTransform {
  transform(value: Card[], style: AreaStyle): object {
    switch (style) {
      case AreaStyle.Deck:
        if (value.length > 0) {
          return [value[0]];
        }
        return value;
      default:
        return value;
    }
  }
}
