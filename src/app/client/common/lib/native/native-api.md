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


→ {method: ‘confirm’, params: { title: 'test', message: 'hello world', yes_btn_text: '是的', no_btn_text: '不是' }, id: 1}
← {__result__ {value: 0, YES:1, NO: 0, CLOSE: 2}, id: 1}

```JavaScript
// invoke 方法是对 sendToNative 的封装
NativeAPI.invoke(
  'confirm',
  {
    title: '提示',
    message: ‘msg’,
    yes_btn_text: '拨打电话',
    no_btn_text: '取消'
  },
  function (err, data) {
    if (data.value === data.YES) {
      alert(‘确认’);
    }
  }
);
```

### alert

* 描述：
Native 版的 window.alert，只有一个「确定」按钮。

__method__

* `alert`

__params__

* `title` String 标题信息
* `message` String 对话框消息
* `btn_text` String 确定按钮⽂文字

__result__

YES Number
0 常量
CLOSE Number
1 常量


→ {method: ‘alert’, params: { title: 123, message: ‘msg’, btn_text: ‘是的’ }, id: 1}
← {__result__ {value: 0, YES:0, CLOSE: 1}, id: 1}

```JavaScript
NativeAPI.invoke(
  'alert',
  {
    title: '提示',
    message: '你确定吗?'
    btn_text: '确定'
  },
  function (err, data) {
    if (data.value === data.YES) {
      alert(‘确认’);
    }
  }
);
```

### createWebView

* 描述：
根据提供的 URL 打开一个新的WebView，顶栏默认有一个返回按钮。createWebView 根据参数决定是否显⽰搜索框等。
注意: 如果control为空, 那么webview应该默认带一个title控件, 并且这个title控件的text为空, 以备后续updateTitle接⼝使⽤用. 

__method__

* `createWebView`

__params__

* `url` String url有可能是相对的,如果是相对路径的话就根据当前webView的url进⾏计算
* `control` Object 可选 包含一个控件的配置。例如显⽰搜索框: control: { type: 'searchBox', text: '关键字', placeholder: '搜索' }
* `controls` Array controls是一个数组, 包含若干个control配置
注意:
control和controls两个都是可选的. 当两个字段同时出现时 controls 覆盖 control。

### headerRightBtn

* 描述：顶栏右侧按钮, 点击后调⽤用js的headerRightBtnClick⽅法, 后续可以通过updateHeaderRightBtn接⼝来更新这个按钮 

__method__

* `headerRightBtn`

__params__

* `icon` String 标⽰btn所使⽤用的icon图标,如果找不到指定的icon图标的情况下使⽤用text字段。icon和text字段同时存在时优先处理icon字段。 
* `text` String 标⽰btn上的⽂文字。
* `data` Object 可选 这是一个任意的json对象,后续如果⽤用户点击按钮时,将这个参数传给headerRightBtnClick。

### back

* 描述：当JS调⽤用Native的back时，Native需要调⽤用JS的back接⼝，然后根据JS的back接⼝的返回逻辑进⾏操作。

__method__

* `back`

→ {method: ‘back’, params:null}

### webViewCallback

* 描述：关闭当前webView, 并将前一个webView的url更新为指定的url。如果没有前一个URL,则执⾏默认⾏为。 默认行为：关闭当前WebView。

__method__

* `webViewCallback`

__params__

* `url` String url有可能是相对的,如果是相对路径的话就根据当前webView的url进⾏计算

→ {method: ‘webViewCallback’, params: {url: '/index.html' }}

### getUserInfo

* 描述：获取当前的⽤用户信息,如果⽤用户未登录,则返回错误。

__method__

* `getUserInfo`

__result__

* `username` String ⽤用户名
* `user_id` String ⽤用户ID

__error__

* `code`
1. -32000: 未知错误
2. -32001: 未登录


### getDeviceInfo

描述：获取当前的客户端信息

__method__

* `getDeviceInfo`

__result__

* `env`        String test|simulation|online
* `customerId` String 用于识别 APP 的自定义的标识
* `token`      String 该字段包含⽤用户的登录信息，后端 API 可以通过将此字段兑换成 sessionId 之类的数据用于校验⽤用户登录状态。
* `userId`     String
* `mac`        String
* `imei`       String
* `deviceId`   String 设备id，主要⽤用于实现推送⺫⽬目的，iOS 由系统提供，Android 上是由⼩米 SDK 提供。


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

* `type`   String 指定按钮类型，例如：'phone', 'order', 'share'等。
* `action` String 控制按钮显⽰与隐藏，当 action == 'show' 的时候展⽰，当 action == 'hide' 的时候隐藏。
* `icon`   String 按钮图片，图片的base64编码，如果没有找到icon则显⽰text字段，text字段默认为空。
* `text`   String 按钮文字，没有 icon 字段时使用。
* `data`   Object btn上附属的数据,在⽤用户点击后传给⻚⾯内的js回调。


### clearAppCache

* 描述：清除设备内遗留的app cache

→ {method: ‘clearAppCache’, params: null }

## 由 JavaScript 提供的方法

### back

* 描述：当 WebView 的顶栏上的返回按钮被点击，或 android 下⽤用户点击系统⾃带返回按钮时，需要由 APP 调⽤ JS 的这个接⼝，根据 JS 返回的值来决定相关⾏为，如果该接⼝执⾏异常，则执⾏默认⾏为（关闭当前 WebView）。

__method__

* `back`

__result__

* `preventDefault` Number 0 表⽰执⾏默认⾏为(在 Android 上表⽰⽴刻关闭当前界⾯)，1 表⽰阻⽌止默认⾏为。

→ {method: ‘back’, params:null, id: 1} ← {__result__ {preventDefault: 0 }, id: 1}

### headerRightBtnClick

* 描述：当客户端顶部右侧的按钮被点击时，触发这个回调，由H5执⾏后续回调。

__params__

* 客户端可以根据各⾃场景⾃定义

→ {method: ‘headerRightBtnClick’, params: null}
→ {method: ‘headerRightBtnClick’, params: { 'foo': 'bar'}}


