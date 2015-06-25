# NativeAPI


## 简介

NativeAPI 用于 JavaScript 与 Native Code 双向通信。


## 创建过程

1. 在 APP 中打开一个 WebView。
2. Native Code 向 WebView 添加全局的 NativeAPI 对象，此对象应当包含 `sendToNative` 方法，JavaScript 通过调用此方法向 Native 发送消息。
3. WebView 中的 JavaScript 在 NativeAPI 对象上注册 `sendToJavaScript` 方法，Native 通过调用此方法此方法向 JavaScript 发送消息。


## 消息格式

[JSON-RPC 2.0](http://www.jsonrpc.org/specification)


## 由 Native 提供的方法


### confirm

* 描述：
弹出一个对话框，包含「确定」「取消」两个按钮。

__method__

* `confirm`

__params__

* `title` String 标题信息
* `message` String 对话框消息
* `yes_btn_text` String 确定按钮⽂文字
* `no_btn_text` String 取消按钮⽂文字

__result__

0 常量，表示点击了NO
1 常量，表示点击了YES
2 常量，表示点击了其他关闭方式

JS -> Native: {method: "confirm", params: { title: "test", message: "hello world", yes_btn_text: "是的", no_btn_text: "不是" }, id: 1}
Native -> JS: {__result__ {value: 0, YES:1, NO: 0, CLOSE: 2}, id: 1}

```JavaScript
// invoke 方法是对 sendToNative 的封装
NativeAPI.invoke(
  "confirm",
  {
    title: "提示",
    message: "msg",
    yes_btn_text: "拨打电话",
    no_btn_text: "取消"
  },
  function (err, data) {
    if (data.value === data.YES) {
      alert("确认");
    }
  }
);
```


### alert

* 描述：Native 版的 window.alert，只有一个「确定」按钮。

__method__

* `alert`

__params__

* `title` String 标题信息
* `message` String 对话框消息
* `btn_text` String 确定按钮⽂文字

__result__

* `YES` Number 常量 1
* `CLOSE` Number 常量 0
* `value` Number 1 或者 0

JS -> Native: {method: "alert", params: { title: 123, message: "msg", btn_text: "是的" }, id: 1}
Native -> JS: {__result__ {value: 0, YES:0, CLOSE: 1}, id: 1}

```JavaScript
NativeAPI.invoke(
  "alert", {
    title: "这是标题",
    message: "这是消息",
    btn_text: "确定按钮"
  },
  function(err, data) {
    if (err) {
      return handleError(err);
    }
    switch (data.value) {
      case data.YES:
        echo("你点了确定按钮");
        break;
      case data.CLOSE:
        echo("你使用其他方式关闭了弹窗");
        break;
      default:
        echo("未知动作，返回code是[" + data.value + "]");
    }
  }
);
```


### close

* 描述：关闭当前 WebView。

__method__

* `close`


### closeAll

* 描述：关闭所有 WebView。

__method__

* `closeAll`


### createWebView

* 描述：根据提供的 URL 打开一个新的WebView，顶栏默认有一个返回按钮。createWebView 根据参数决定是否显⽰搜索框等。
注意: 如果control为空, 那么webview应该默认带一个title控件, 并且这个title控件的text为空, 以备后续updateTitle接⼝使⽤. 

__method__

* `createWebView`

__params__

* `url` String url有可能是相对的,如果是相对路径的话就根据当前 webView 的 url 进⾏计算
* `controls` Array controls是一个数组，元素中 `type: title` 表示要设置的是标题，`text: "Native Page 2"` 为具体文本。
注意:
controls 为可选参数

```JavaScript
NativeAPI.invoke("createWebView", {
  url: window.location.origin + "xxx",
  controls: [
    {
      type: "title",
      text: "Native Page 2"
    }
  ]
});
```


### back

* 描述：当JS调⽤Native的back时，Native需要调⽤JS的back接⼝，然后根据JS的back接⼝的返回逻辑进⾏操作。

__method__

* `back`

JS -> Native: {method: "back", params:null}


### webViewCallback

* 描述：关闭当前webView, 并将前一个webView的url更新为指定的url。如果没有前一个URL,则执⾏默认⾏为。 默认行为：关闭当前WebView。

__method__

* `webViewCallback`

__params__

* `url` String url有可能是相对的,如果是相对路径的话就根据当前webView的url进⾏计算

JS -> Native: {method: "webViewCallback", params: {url: "/index.html" }}


### login

* 描述：启动客户端登录界面，如果登录成功，应返回原来的 WebView。

__method__

* `login`

__params__

* 不带参数，根据客户端⾃定义。

__reslut__
* `SUCC`   常量，表示登录流程完成
* `FAIL`   常量，表示登录流程中断
* `CANCEL` 常量，表示用户在登录过程中作了取消操作
* `value`  它的值应该是 SUCC/FAIL/CANCEL 其中之一，用来判断成功/失败等状态。


### getUserInfo

* 描述：获取当前的⽤户信息。可以传appName参数，如'gtgj' 代表 高铁管家的用户信息，'hbgj'代表航班管家的用户信息。如果没有该参数，则返回该客户端默认的用户信息。如果⽤户未登录，则返回错误。

__method__

* `getUserInfo`

__params__

* `appName` String "gtgj"代表高铁管家，"hbgj"代表航班管家。

__result__

* `phone` String ⽤户电话
* `uid` String 
* `userid` String ⽤户ID
* `authcode` String 
* `hbuserid`   String 过渡期参数，下一版本统一用 userid。
* `hbauthcode` String 过渡期参数，下一版本统一用 authcode。

__error__

* `code`
1. -32000: 未知错误
2. -32001: 未登录


### getDeviceInfo

描述：获取当前的客户端信息

__method__

* `getDeviceInfo`

__result__

* `imei`    String 移动设备国际识别码
* `p`       String 用于识别 APP 的自定义的标识
* `uuid`    String 该字段包含⽤户的登录信息，后端 API 可以通过将此字段兑换成 sessionId 之类的数据用于校验⽤户登录状态。
* `channel` String 例如：appstore
* `name`    String 例如：gtgj
* `version` String APP 版本


### makePhoneCall

* 描述：根据指定号码拨打电话

__method__

* `makePhoneCall`

__params__

* `number` String 电话号码

__result__

* `value` Number


### updateTitle

* 描述：更新标题栏⽂文字

__method__

* `updateTitle`

__params__

* `text` String 标题栏⽂文字


### storage

* 描述：storage 接⼝实现一个异步的本地存储⽅案, 该存储便于 APP 和 JS 访问, 同时容量应大于50MB。设计此接口的目的为规避 LocalStorage 在一些系统上存在的实时性方面的一些 [bug](http://tianfangye.com/2014/10/18/using-local-storage/)。

__method__

* `storage`

__params__

* `action` String 操作名称 [get|set|remove]
* `key` String
* `value` String

__result__

* `value` String


### updateHeaderRightBtn

* 描述：改变顶部右侧按钮

__method__

* `updateHeaderRightBtn`

__params__

* `type`   String 指定按钮类型，例如："phone", "order", "share"等。
* `action` String 控制按钮显⽰与隐藏，当 action == "show" 的时候展⽰，当 action == "hide" 的时候隐藏。
* `icon`   String 按钮图片，图片的base64编码，如果没有找到icon则显⽰text字段，text字段默认为空。
* `text`   String 按钮文字，没有 icon 字段时使用。
* `data`   Object btn上附属的数据,在⽤户点击后传给⻚⾯内的js回调。


### clearAppCache

* 描述：清除设备内遗留的 [application cache](http://www.html5rocks.com/zh/tutorials/appcache/beginner/)

JS -> Native: {method: "clearAppCache", params: null }


### isSupported

* 描述：查询 API 可用性。

__method__

* `isSupported`

__params__

* `method` String 需要查询的方法

__result__

* `value` Boolean true 支持，false 不支持。由于历史原因，isSupported 方法目前返回value:"1/0"。


### selectContact

* 描述：选择联系人 (使用手机本身的联系人界面)。

__method__

* `selectContact`

__params__

* `maxNum` Number 表示选择联系人的数量上限，默认为1（即单选），0 则表示不设上限。

__result__

* `name`  String 名字
* `phone` String 电话号码
* `contacts` Array 以数组形式返回联系人信息。原本的 `name` 和 `phone` 字段，则为数组中第一个联系人的信息（即兼容单选）。


### setOrientation

* 描述：用来设定 webView 的显示方向。

__method__

* `setOrientation`

__params__

* `orientation` String 默认值为 `portrait`（强制竖屏），其他值包括 `auto`（跟随手机旋转），`landscape`（强制横屏）。


### sendSMS

* 描述：发送短信

__method__

* `sendSMS`

__params__

* `phone` String
* `message` String

__result__

* `value` Boolean true 成功，false 不成功。


### getCurrentPosition

* 描述：获取当前位置

__method__

* `getCurrentPosition`

__result__

* `latitude`  The latitude as a decimal number
* `longitude` The longitude as a decimal number
* `accuracy`  The accuracy of position
* `heading`   The heading as degrees clockwise from North
* `speed`     The speed in meters per second
* `timestamp` The date/time of the response


### scanBarcode

* 描述：使用摄像头扫描二维码。

__method__

* `scanBarcode`

__result__

* `value` String 扫描得到的字符串


### sharePage

* 描述：使用客户端分享功能。

__method__

* `sharePage`

__params__

* `title`  String 分享块标题
* `desc`   String 分享块描述
* `link`   String 分享块链接
* `imgUrl` String 分享块图片
* `type`   String 分享类型；支持 `weixin` `weibo` `pengyouquan` `sms` `email`；如果是 `all` 表示想要分享到所有，此参数为空或不传此参数时，效果应等同于 `all`。
  
__result__

* `value` Boolean true 成功，false 不成功。


### trackEvent

* 描述：客户端统计。自定义事件记录。

__method__

* `trackEvent`

__params__

* `event` String 记录事件名
* `attrs` String 统计字符串(JSON String)


### startPay

* 描述：js调用startPay方法，将支付参数传递给app，app支付完成后调用js的startPay提供的callback(仅告之支付交互层面上的成功/失败，web需要自己查询支付结果)，js在callback中继续完成后续的交互处理(如支付流程需要authcode，可以通过getUserInfo获取authcode，支付接口调用不再涉及authcode传输)。

__method__

* `startPay`

__params__

* `quitpaymsg` String 退出时候的提示
* `title` String 支付标题
* `price` String 商品价格
* `orderid` String 订单号
* `productdesc` String 商品描述
* `url` String 显示订单基本信息的Wap页面
* `subdesc` String 商品详情描述
* `canceltype` String 取消等待支付结果的跳转类型：0代表跳转机票订单，1代表跳转酒店订单，2代表跳转其他订单，-1代表不做跳转(默认为-1)

__reslut__

* `SUCC`    常量，表示支付成功
* `FAIL`    常量，表示支付失败
* `CANCEL`  常量，表示用户取消了支付（高铁管家3.3开始支持）
* `PENDING` 常量，表示目前为支付待确认状态，由于第三方支付结果可能需要等待较长的时间，未知状态时可以返回 PENDING
* `value`   SUCC/FAIL/CANCEL/PENDING

```JavaScript
NativeAPI.invoke("startPay", {
  quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“个人中心->其他订单”完成支付。确认退出吗？, ",
  title: "商城订单",
  price: "145",
  orderid: "150513188189022",
  productdesc: "接机订单支付",
  subdesc: "专车接送",
  url: "http://jp.rsscc.com/Fmall/rest/client/v4/pay.htm?orderid=150513188189022",
  canceltype: -1
}, function(err, data) {
  switch (data.value) {
    case data.SUCC:
      alert("支付成功， 跳转详情");
      break;
    case data.FAIL:
      alert("支付失败");
      break;
    case data.CANCEL:
      alert("您取消了支付");
      break;
    case data.PENDING:
      alert("目前为支付待确认状态");
      break;
    default:
      alert("支付异常");
  }
});
```

### loading

* 描述：加载中样式的提示框。

__method__

* `loading`

__params__

* `show` Number 1 显示，0 隐藏
* `text` String 显示的文字

__result__

* `SUCC`   常量，正常显示
* `FAIL`   常量，显示失败
* `CANCEL` 常量，点了返回键
* `value`  SUCC/FAIL/CANCEL


## 由 JavaScript 提供的方法


### resume

* 描述：有上一个 webview 返回当前 webview 时候触发。例如：从 c.html 所在的 webview 返回 b.html 所在的 webview 时，在 b.html 所在的 Webview 上 Native 应调用 JS 的 resume 方法，所传参数 prevUrl 为 a.html，nextUrl 为 c.html。

__method__

* `resume`

__params__

* `prevUrl` String 当前 webview 为基准，前一个 webview 的 URL（没有就为空）。
* `nextUrl` String 当前 webview 为基准，后一个 webview 的 URL。

Native -> JS: {method: "resume", params: {prevUrl: "a.html", nextUrl: "c.html"}}


### back

* 描述：当 WebView 的顶栏上的返回按钮被点击，或 android 下⽤户点击系统⾃带返回按钮时，需要由 APP 调⽤ JS 的这个接⼝，根据 JS 返回的值来决定相关⾏为，如果该接⼝执⾏异常，则执⾏默认⾏为（关闭当前 WebView）。

__method__

* `back`

__result__

* `preventDefault` Boolean false 表⽰执⾏默认⾏为(在 Android 上表⽰⽴刻关闭当前界⾯)，true 表⽰阻⽌止默认⾏为。

流程说明：点返回按钮——N 调用 J 的 back——J 返回给 N {preventDefault: true/false}——N 根据 preventDefault 值决定是否执行返回操作。

Native -> JS: {method: "back", params:null, id: 1}
JS -> Native: {result: {preventDefault: false}, id: 1}


### headerRightBtnClick

* 描述：当客户端顶部右侧的按钮被点击时，触发这个回调，由H5执⾏后续回调。

__params__

* 客户端可以根据各⾃场景⾃定义

Native -> JS: {method: "headerRightBtnClick", params: null}
Native -> JS: {method: "headerRightBtnClick", params: { "foo": "bar"}}
