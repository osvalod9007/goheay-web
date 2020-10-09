class FormatNumber {
  /**
   * Convert number to float.
   * @param num
   *
   */
  formatFloat(num, places = 2) {
    return num && parseFloat(String(num)).toFixed(places);
  }
}

const formatNumber = new FormatNumber();
export default formatNumber;
