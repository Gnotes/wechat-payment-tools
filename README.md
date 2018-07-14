# wechat-payment-tools

> A tool for wechat payment with `Signature`、 `Request` and `XML-Object Convert` .

## Installation

```bash
npm install @xinghe/wechat-payment-tools
```

## Usage

```node
var WeChatPay = require('@xinghe/wechat-payment-tools');

var params = {
  appid: '',
  mch_id: '',
  nonce_str: WeChatPay.randomStr(),
  sign_type: 'MD5',
  ...
};

var signStr = WeChatPay.sign(params); // 签名字符串
```

## API

- sign

> 签名方法，返回签名字符串

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| data | Object | 待签名参数 |
| secretKey | String | key为商户平台设置的密钥key |

- filter

> 过滤函数，用于过滤空值，返回非空的签名参数对象

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| data | Object | 待签名参数对象 |

- sort

> 升序排序方法，返回升序排序后key数组

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| keys | Array | 签名参数对象的key组成的数组 |

- randomStr

> 随机字符串生成方法，返回签名随机字符串

- md5

> MD5加密方法，返回加密后的MD5字符串

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| unSignStr | String | 加密前的字符串 |

- dataToArray

> 将Object对象转换为数组，返回`[{key:value}]`数组

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| data | Object | 加密前的字符串 |

- objectToXml

> 将对象数据转换为xml格式

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| objArr | Array{Object} | 对象数组 |

- xmlToObject

> 将xml字符串转换为对象

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| xmlStr | String | xml字符串 |

- unifiedOrder

> 统一下单接口，返回Promise请求对象

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| xmlData | XMLData | xml格式参数 |

- orderQuery

> 订单查询接口，返回Promise请求对象

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| xmlData | XMLData | xml格式参数 |

- codeToSession

> 小程序获取openID接口，返回Promise请求对象

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| code | String | 临时凭证参数 |

- fillZero

> 订单号补位方法，微信支付订单号位数不能太小，返回补位后的字符编号

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 唯一编号 |
| length | Number | 最小长度 |

- strToDate

> 通过字符串时间格式 `201902021222` 转换为 Date对象

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| dateStr | String | 时间字符串 |



