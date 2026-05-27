import { Pipe, PipeTransform } from '@angular/core';
import { PriceUnit } from '../../core/models/product.model';

@Pipe({ name: 'priceUnit', standalone: true })
export class PriceUnitPipe implements PipeTransform {
  transform(price: number, unit: PriceUnit): string {
    const formatted = new Intl.NumberFormat('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
    return `${formatted} €/${unit}`;
  }
}
