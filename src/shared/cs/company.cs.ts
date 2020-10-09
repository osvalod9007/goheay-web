export class Company {
  id;
  name;
  constructor(item: Partial<Company> = {}) {
    const {id, name} = item;
    this.id = id || undefined;
    this.name = name || '';
  }
}
