var $ = require("jquery");
var ScratchCard = require("com/mobile/widget/scratch-card/scratch-card.js");

$("canvas")
  .on("getImageURL", function(e, canvas) {
    canvas.style.backgroundImage = "url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)";
  })
  .on("showResult", function(e, resetCard) {
    window.alert("自定义方法");
    resetCard();
  });

new ScratchCard({ el: "canvas" });
