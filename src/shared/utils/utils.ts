class Utils {
  /**
   * For query string
   */
  getQueryString() {
    const pairs = window.location.search.slice(1).split('&');

    const result = {};
    pairs.forEach(pair => {
      const pairSplited = pair.split('=');
      result[pairSplited[0]] = decodeURIComponent(pairSplited[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
  }
}

const utils = new Utils();
export default utils;
