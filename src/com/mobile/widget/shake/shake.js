import _ from "lodash";

/**
 * @ config SHAKE_THRESHOLD 摇动的幅度， DEBOUNCE_TIME： 执行函数响应间隔
 * 
 */
class Shake {
  constructor(hanlder, config) {
    this.canPlay = false;
    // this.createAudio();
    let x = 0, y = 0, z = 0, _x = 0, _y = 0, _z = 0;
    this.config = {};
    this.defaultConfig = {
      SHAKE_THRESHOLD: 50,
      DEBOUNCE_TIME: 600
    };
    _.extend(this.config, this.defaultConfig, config);
    if (!window.DeviceMotionEvent) {
      alert('您的设备不支持摇一摇');
      return;
    }

    var shakeHanlder = _.debounce( hanlder, 400);
    window.addEventListener('devicemotion', function (e) {
      var acceleration = e.accelerationIncludingGravity;
      x = acceleration.x;
      y = acceleration.y;
      z = acceleration.z;
      var change = Math.abs(x + y + z - _x - _y - _z);
      if(change > this.config.SHAKE_THRESHOLD){
        this.canPlay && this.audio.play();
        shakeHanlder();
      }
      _x = x;
      _y = y;
      _z = z;
    }.bind(this), false);
  }

  set Config(config) {
    _.extend(this.config, config);
  }

  createAudio() {
    this.audio = document.createElement("audio");
    this.audio.setAttribute("src", "http://zjyd.sc.chinaz.com/files/download/sound1/201410/5018.wav");
    this.audio.setAttribute("controls", "controls");
    this.audio.className = "shake-audio";
    // this.audio.setAttribute("autoplay", "autoplay");
    this.audio.setAttribute("preload", "auto");
    window.document.body.appendChild(this.audio);
  }
  play() {
    if(this.audio && this.audio.paused){
      this.audio.play();
    }

  }

  pause() {
    this.audio.pause();
  }

  togglePlay () {
    if(this.canPlay) {
      this.canPlay = false;
    }else{
      this.canPlay = true;
      this.play();
      this.pause();
    }
    return this.canPlay;
  }

  stop() {

  }

}
module.exports = Shake;