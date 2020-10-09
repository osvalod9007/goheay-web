export class Product {
  id;
  quantity;
  isSameDimension;
  totalCubicDimension;
  items;

  constructor(item: Partial<Product> = {}) {
    const {id, quantity, isSameDimension, totalCubicDimension, items} = item;

    this.id = id || undefined;
    // this.rating = rating || 0;
    // this.basicProfile = basicProfile ? {...new BasicProfile(basicProfile)} : new BasicProfile();
    this.quantity = quantity;
    this.isSameDimension = isSameDimension;
    this.totalCubicDimension = totalCubicDimension ? totalCubicDimension.amount : 0;
    this.items = items || []; // create order product item
  }
}
