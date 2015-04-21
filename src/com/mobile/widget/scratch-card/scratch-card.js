var Backbone = require("backbone");
var _        = require("underscore");

/**
 * # 刮刮卡 canvas
 * 
 * 此 widget 需要加在 canvas 元素上。
 * 
 * data-fill-text 指定涂层上的提示文字（可选）
 * data-get-image 指定返回刮开后的图片 URL 的方法名称。
 * data-callback  指定刮完后需要执行的方法名称。
 * 
 * HTML 示例：
 * ```HTML
 * <canvas width="228" height="105"
 *     data-fill-text="来刮我试试！"
 *     data-fill-font="20px Microsoft YaHei"
 *     data-font-color="white"
 *     data-text-align="center"
 *     data-text-base-line="middle"
 *     data-fill-text-x=""
 *     data-fill-text-y=""
 *     data-fill-color="gray"
 *     data-get-image="getImageURL"
 *     data-callback="showResult"
 * >
 * </canvas>
 * ```
 */
module.exports = Backbone.View.extend({
    events: {
        "mousedown": "drawStart",
        "mouseup": "drawEnd",
        "mousemove": "draw",
        "touchstart": "drawStart",
        "touchend": "drawEnd",
        "touchmove": "draw"
    },
    initialize: function() {
        this.config = this.$el.data();
        this.config.endAngle = Math.PI * 2;
        this.config.canvas = this.$el[0];
        this.config.offsetX = this.config.canvas.offsetLeft;
        this.config.offsetY = this.config.canvas.offsetTop;
        this.config.ctx = this.config.canvas.getContext("2d");
        this.initCard();
        _.bindAll(this, "initCard");
    },

    /**
     * @name drawStart
     *
     * 刮动作开始时的处理函数
     *
     * @param {Event} dom event
     */
    drawStart: function(e) {
        e.preventDefault();

        var config = this.config;
        var canvas = config.canvas;
        var funcName = this.$el.data("getImage");
        
        // this[funcName](canvas);
        this.$el.trigger(funcName, [canvas]);
        config.drawFlag = true;
    },

    /**
     * @name drawEnd
     *
     * 刮动作结束时的处理函数
     *
     * @param {Event} dom event
     */
    drawEnd: function(e) {
        e.preventDefault();

        var config = this.config;

        config.drawFlag = false;
        var canvas = config.canvas;

        var data = config.ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        var particle = 100;
        var increment = parseInt(data.length / particle, 10);
        var inc1 = parseInt(increment * 0.25, 10);
        var inc2 = parseInt(increment * 0.5, 10);
        var inc3 = parseInt(increment * 0.75, 10);

        for (var i = 0, j = 0, len = data.length; i < len; i += increment) {
            if (data[i] && data[i + inc1] && data[i + inc2] && data[i + inc3]) {
                j += 1;
            }
        }

        if (!config.resultFlag) {
            if (j <= particle * 0.1) {
                var funcName = this.$el.data("callback");

                config.resultFlag = true;
                // this[funcName](canvas);
                this.$el.trigger(funcName, [this.initCard]);
            }
        }
    },

    /**
     * @name draw
     *
     * 刮动作进行时的处理函数
     *
     * 刮的同时清除刮刮卡涂层
     *
     * @param {Event} dom event
     */
    draw: function(e) {
        e.preventDefault();

        var config = this.config;

        if (config.drawFlag) {
            var _e = e.originalEvent || e;
            var touches = _e.changedTouches;

            if (touches) {
                _e = touches[touches.length - 1];
            }

            var x = (_e.clientX + document.body.scrollLeft || _e.pageX) - config.offsetX || 0;
            var y = (_e.clientY + document.body.scrollTop || _e.pageY) - config.offsetY || 0;
            var ctx = config.ctx;

            ctx.beginPath();
            ctx.arc(x, y, 15, 0, config.endAngle);
            ctx.fill();
            ctx.closePath();
        }
    },

    /**
     * @name initCard
     *
     * 初始化刮刮卡
     */
    initCard: function() {
        var config = this.config;

        config.drawFlag = false;
        config.resultFlag = false;
        
        var canvas = config.canvas;
        var ctx = config.ctx;

        canvas.style.backgroundColor = "transparent";

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = config.fillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (config.fillText) {
            ctx.fillStyle    = config.fontColor;
            ctx.font         = config.fillFont;
            ctx.textAlign    = config.textAlign;
            ctx.textBaseline = config.textBaseLine;

            var fillTextX = config.fillTextX || canvas.width / 2;
            var fillTextY = config.fillTextY || canvas.height / 2;

            ctx.fillText(config.fillText, fillTextX, fillTextY);
        }

        ctx.globalCompositeOperation = "destination-out";
    }
});