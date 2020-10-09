export class Currency {
  id;
  name;
  alphabeticCode;

  constructor(item: Partial<Currency> = {}) {
    const {id, name, alphabeticCode} = item;
    this.id = id || 'MzM2SHNRSzZGMXF3NmNSTVdTdlhxMlY6NQ';
    this.name = name || '';
    this.alphabeticCode = alphabeticCode || '';
  }
}
