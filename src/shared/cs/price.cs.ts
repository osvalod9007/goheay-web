/**
 * Price class
 */
export class Price {
  id;
  prices;

  constructor(item: Partial<Price> = {}) {
    const {id, prices} = item;
    this.id = id || undefined;
    this.prices = prices || [];
  }
}
