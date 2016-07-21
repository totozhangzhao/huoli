module.exports = function(url, sync) {
  var doc  = document;
  var node = doc.createElement("script");

  node.charset = "utf-8";
  node.async   = !sync;
  node.src     = url; // version

  var head        = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
  var baseElement = head.getElementsByTagName("base")[0];

  // ref: #185 & http://dev.jquery.com/ticket/2709
  baseElement ?
      head.insertBefore(node, baseElement) :
      head.appendChild(node);
};
