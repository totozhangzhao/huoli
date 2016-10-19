import $ from "jquery";
import UrlUtil from "com/mobile/lib/url/url.js";

export function createUrl(options) {
  let url = options.url;

  if (url === "" || url === null || url === undefined) {
    return;
  }

  function separateHash(url) {
    let separateHash = url.split("#");

    if ( separateHash.length > 1 ) {
      return {
        url: separateHash[0],
        hash: `#${separateHash[1]}`
      };
    } else {
      return {
        url,
        hash: ""
      };
    }
  }

  let urlAndHash = separateHash(url);

  url = urlAndHash.url;

  if ( options.queryObj ) {
    url = url.indexOf("?") >= 0 ? `${url}&` : `${url}?`;
    url = url + $.param(options.queryObj);
  }

  function passOnParam(key) {
    let urlObj = UrlUtil.parseUrlSearch();
    let val = urlObj[key];

    if (val !== undefined) {
      url = url.indexOf("?") >= 0 ? `${url}&` : `${url}?`;
      url = url + `${key}=${val}`;
    }
  }

  passOnParam("hlfrom");

  return url + urlAndHash.hash;
}
