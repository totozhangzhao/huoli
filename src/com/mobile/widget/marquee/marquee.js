var $ = require("jquery");

/*
  @param direction 方向    0: 从上到下 1: 从右到左 2: 从下到上 3: 从左到右 
  @param box 滚动元素的外容器
  @param items 元素列表
  @param speed 滚动速度 一次滚动消耗的时间
  @param interval 每次滚动的时间间隔
*/
function Marquee(options) {

  this._count = 0;
  this._index = 0;
  this._defaultConfig ={
    speed: 400,
    interval: 4000,
    direction: 0
  };
  this._config = $.extend(this._defaultConfig, options);
  this.init();

}

Marquee.prototype.init = function () {
  var self = this;
  this._config.box.css("overflow","hidden");
  this._config.items.css({position:"absolute",top:0,left:0});
  this._count = this._config.items.length;
  this._index = 0;
  this._box_width = this._config.box.width();
  this._box_height = this._config.box.height();
  // 没有或者只有一个元素
  if (this._count <= 1){
    return;
  }
  this.translateInit();
  this.translate(this._config.items[0].style, 0, 0, this._config.speed);
  this.start();
};
Marquee.prototype.move = function (curIndex, targetIndex) {
  this.translateMove(this.prevIndex, targetIndex, curIndex);
  this.prevIndex = curIndex;
};
Marquee.prototype.prev = function () {

};
Marquee.prototype.next = function () {
  var curIndex = this._index;
  this._index ++ ;
  if (this._index >= this._count){
    this._index = 0;
  }
  this.move(curIndex, this._index);
};
Marquee.prototype.start = function () {
  var self = this;
  setInterval(function () {
    self.next();
  },this._config.interval);
};

// 初始化转换
Marquee.prototype.translateInit = function () {
  var self = this;
  this._config.items.each(function (index, item) {
    if(index === 0){
      // self.translate(item.style, 0, 0, 0);
      self.translate(item.style, self._box_width, self._box_height, 0);
    }else{
      self.translate(item.style, self._box_width, self._box_height, 0);
    }
  });
};

// style: DOM style  x: 横向偏移量 y: 纵向偏移量
Marquee.prototype.translate = function (style, x, y, speed) {
  var _3dtsl, _2dtsl;
  switch(this._config.direction){
    case 0:
      _3dtsl = "translate3D(0, " + ( - y) + "px, 0)";
      _2dtsl = "translate(0, " + ( - y) + "px)";
      break;
    case 1:
      _3dtsl = "translate3D("+ (x) +"px, 0, 0)";
      _2dtsl = "translate("+ (x) +"px, 0)";
      break;
    case 2:
      _3dtsl = "translate3D(0, " + ( y) + "px, 0)";
      _2dtsl = "translate(0, " + ( y) + "px)";
      break;
    case 3:
      _3dtsl = "translate3D("+ ( - x) +"px, 0, 0)";
      _2dtsl = "translate("+ ( - x) +"px, 0)";
      break;
  }

  style.webkitTransitionDuration =
  style.MozTransitionDuration =
  style.msTransitionDuration =
  style.OTransitionDuration =
  style.transitionDuration = speed + "ms";

  
  style.webkitTransform =
  style.transform = _3dtsl;
  style.msTransform =
  style.MozTransform =
  style.OTransform = _2dtsl;
};

// prevIndex  上一个焦点位置, targetIndex 本次焦点位置  curIndex 本次移动前的焦点位置
Marquee.prototype.translateMove = function (prevIndex, targetIndex, curIndex){
  var self = this;
  if(prevIndex >= 0){
    this.translate(this._config.items[prevIndex].style, this._box_width, this._box_height, 0);
  }
  var delay = this._count > 2 ? 0 : 100;// 低于两个元素
  setTimeout(function() {
    self.translate(self._config.items[targetIndex].style, 0, 0, self._config.speed);
    self.translate(self._config.items[curIndex].style, -self._box_width, -self._box_height, self._config.speed);
  },delay);
  
};

module.exports = Marquee;


