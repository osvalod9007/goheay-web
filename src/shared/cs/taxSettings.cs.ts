export class TaxSetting {
  id;
  tax;
  countryId;
  stateId;
  state;
  country;
  constructor(item: Partial<TaxSetting> = {}) {
    const {id, tax, state, country} = item;
    this.id = id || undefined;
    this.tax = tax || '';
    this.countryId = country ? country.id : 'MzM2SHNRSzZGMXF3NmNSTVdTdlhxMlY6MQ';
    this.stateId = state ? state.id : '';
  }
}
