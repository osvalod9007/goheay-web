class Masks {
  /**
   * Mask ZIP CODE.
   * @param toFormat
   * output: 23333
   * output: 23333-3333
   */
  maskZip(toFormat) {
    if (toFormat !== '' && toFormat !== null && toFormat !== undefined) {
      const tmpValue = toFormat.replace(/\D/g, '').substring(0, 10);
      const zip = tmpValue.substring(0, 5);
      const last = tmpValue.substring(5, 9);
      let finalValue = '';
      if (tmpValue.length > 0 && tmpValue.length <= 5) {
        finalValue = `${zip}`;
      } else {
        finalValue = `${zip}-${last}`;
      }
      return finalValue;
    }
    return toFormat;
  }

  /**
   * @param toFormat
   * output: 22-1234567
   */
  maskEmployerId(toFormat) {
    if (toFormat !== '' && toFormat !== null && toFormat !== undefined) {
      const tmpValue = toFormat.replace(/\D/g, '').substring(0, 9);
      const init = tmpValue.substring(0, 2);
      const last = tmpValue.substring(2, 9);
      let finalValue = '';
      if (tmpValue.length > 0 && tmpValue.length <= 2) {
        finalValue = `${init}`;
      } else {
        finalValue = `${init}-${last}`;
      }
      return finalValue;
    }
    return toFormat;
  }
}

const masks = new Masks();
export default masks;
