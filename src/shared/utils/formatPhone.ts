import {FormatPhoneTypeEnum} from '../enums/FormatPhoneType.enum';

class FormatPhone {
  /**
   * Convert the phone according to the type of format that is selected
   * @param toFormat
   * @param isList
   * @param countryId
   * @param typeFormat
   * output: (333) 333-3333 (National Format)
   * output: 1-333-333-3333 (Dialed US format)
   * output: +1 333 333 3333 (International format)
   * output: 333 3333 (Local format)
   * output: +13333333333 (RFC format)
   *
   */
  formatsGeneral(toFormat, isList: boolean, countryId: string, typeFormat: FormatPhoneTypeEnum) {
    const tmpValue = toFormat.replace(/\D/g, '').substring(0, 10);
    const zip = tmpValue.substring(0, 3);
    const middle = tmpValue.substring(3, 6);
    let last = tmpValue.substring(6, 10);
    switch (typeFormat) {
      case FormatPhoneTypeEnum.DIALECT_US:
        return this.formatDialedUS(tmpValue, zip, middle, last, isList, countryId);
      case FormatPhoneTypeEnum.INTERNATIONAL:
        return this.formatInternational(tmpValue, zip, middle, last, isList, countryId);
      case FormatPhoneTypeEnum.LOCAL: {
        last = tmpValue.substring(3, 7);
        return this.formatLocal(tmpValue, zip, last);
      }
      case FormatPhoneTypeEnum.RFC:
        return this.formatRFC(toFormat, isList, countryId);
      default:
        return this.formatNational(tmpValue, zip, middle, last);
    }
  }

  /**
   * Convert Phone to National Format
   * @param tmpValue
   * @param zip
   * @param middle
   * @param last
   * output: (333) 333-3333
   */
  formatNational(tmpValue: string, zip: string, middle: string, last: string) {
    let finalValue = '';
    if (tmpValue.length > 6) {
      finalValue = `(${zip}) ${middle} - ${last}`;
    } else if (tmpValue.length > 3) {
      finalValue = `(${zip}) ${middle}`;
    } else if (tmpValue.length > 0) {
      finalValue = `(${zip}`;
    }
    return finalValue;
  }

  /**
   * Convert Phone to International Format
   * @param tmpValue
   * @param zip
   * @param middle
   * @param last
   * @param isList
   * @param countryId
   * output: +1 333 333 3333
   * output: 333 333 3333
   */
  formatInternational(tmpValue: string, zip: string, middle: string, last: string, isList: boolean, countryId: string) {
    return isList
      ? `+${countryId} ${this.conformValue(tmpValue, zip, middle, last)}`
      : this.conformValue(tmpValue, zip, middle, last);
  }

  /**
   * Convert Phone to RFC Format
   * @param value
   * @param isList
   * @param countryId
   * output: +13333333333
   * output: 13333333333
   */
  formatRFC(value, isList: boolean, countryId: string) {
    if (isList) {
      value = `+${countryId}${value}`;
    }
    return value;
  }

  /**
   * Convert Phone to Local Format
   * @param tmpValue
   * @param zip
   * @param last
   * output: 333 3333
   *
   */
  formatLocal(tmpValue: string, zip: string, last: string) {
    let value = '';
    if (tmpValue.length > 3) {
      value = `${zip} ${last}`;
    } else if (tmpValue.length > 0) {
      value = `${zip}`;
    }
    return value;
  }

  /**
   * Convert to  Phone to Dialed US Format
   * @param tmpValue
   * @param zip
   * @param middle
   * @param last
   * @param isList
   * @param countryId
   * output: 1-333-333-3333
   * output: 333-333-3333
   */
  formatDialedUS(tmpValue: string, zip: string, middle: string, last: string, isList: boolean, countryId: string) {
    return isList
      ? `${countryId}-${this.conformValue(tmpValue, zip, middle, last, '-')}`
      : this.conformValue(tmpValue, zip, middle, last, '-');
  }

  /**
   * Convert to value to a format phone with separator specified
   * @param tmpValue
   * @param zip
   * @param middle
   * @param last
   * @param separator
   * output: 333 333 3333
   * output: 333-333-3333
   *
   */
  conformValue(tmpValue: string, zip: string, middle: string, last: string, separator: string = ' ') {
    let value = '';
    if (tmpValue.length > 6) {
      value = `${zip}${separator}${middle}${separator}${last}`;
    } else if (tmpValue.length > 3) {
      value = `${zip}${separator}${middle}`;
    } else if (tmpValue.length > 0) {
      value = `${zip}`;
    }
    return value;
  }

  /**
   * Convert to value to string
   * @param toFormat
   * output: 3333333333
   *
   */
  formatToString(toFormat) {
    return toFormat.replace(/\D/g, '').substring(0, 10);
  }
}

const formatPhone = new FormatPhone();
export default formatPhone;
