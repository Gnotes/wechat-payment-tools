'use strict';
/**
 * 协议规则
 * https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=4_1
 * 
 * 1. HTTPS
 * 2. POST方法提交
 * 3. 提交和返回数据都为XML格式，根节点名为xml
 * 4. UTF-8字符编码
 * 5. 签名算法MD5
 * 6. 签名要求->请求和接收数据均需要校验签名 https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=4_3
 * 7. 证书要求->调用申请退款、撤销订单接口需要"商户证书"
 * 8. 判断逻辑->先判断协议字段返回，再判断业务返回，最后判断交易状态（这一点对接口数据返回判断很重要）
 */

/**
 * 参数规定
 * https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=4_2
 * 
 * 1. body:
 *    使用场景        支付模式   商品字段规则                            样例                   备注
 *    第三方手机浏览器  H5支付    浏览器打开的移动网页的主页title名-商品概述  腾讯充值中心-QQ会员充值
 * 2. 交易金额:
 *    交易金额默认为人民币交易，接口中参数支付金额单位为【分】，
 *    参数值不能带小数。对账单中的交易金额单位为【元】。
 *    外币交易的支付金额精确到币种的最小单位，参数值不能带小数点
 * 3. 交易类型:
 *    JSAPI--公众号支付、NATIVE--原生扫码支付、APP--app支付、MWEB--H5支付
 * 4. 货币类型
 *    CNY
 * 5. 时间
 *    标准北京时间，时区为东八区
 * 6. 时间戳
 *    标准北京时间，时区为东八区
 * 7. 商户订单号
 *    商户支付的订单号由商户自定义生成，微信支付要求商户订单号保持唯一性
 */

/**
 * 安全规范
 * https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=4_3
 * 
 * 1. 签名算法
 * 签名步骤：
 * a) 设所有发送或者接收到的数据为集合M，将集合M内 “非空” 参数值的参数按照 “参数名” ASCII码从 “小到大排序” （字典序，即升序排列），
 *    使用URL “键值对” 的格式（即key1=value1&key2=value2…）拼接成字符串stringA。
 *    注：
 *    参数名区分大小写
 *    验证调用返回或微信主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验
 * b) 在stringA最后拼接上key(微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置)得到stringSignTemp字符串，
 *    并对stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值signValue
 * 
 * 示例：
 * appid：-> wxd930ea5d5a258f4f 
 * mch_id：-> 10000100 
 * device_info：-> 1000 
 * body：-> test 
 * nonce_str：-> ibuaiVcKdpRxkhJA
 * 
 * a): stringA = "appid=wxd930ea5d5a258f4f&body=test&device_info=1000&mch_id=10000100&nonce_str=ibuaiVcKdpRxkhJA";
 * b): 假设key = "192006250b4c09247ec02edce69f6a2d"
 *     stringSignTemp = stringA+"&key=192006250b4c09247ec02edce69f6a2d"
 *     sign = MD5(stringSignTemp).toUpperCase()
 *          = "9A0A8659F005D6984697E2CA0A9CF3B7"
 * 
 * 最终得到最终发送的数据：
 * 
 * <xml>
 * <appid>wxd930ea5d5a258f4f</appid>
 * <mch_id>10000100</mch_id>
 * <device_info>1000</device_info>
 * <body>test</body>
 * <nonce_str>ibuaiVcKdpRxkhJA</nonce_str>
 * <sign>9A0A8659F005D6984697E2CA0A9CF3B7</sign>
 * </xml>
 * 
 * 2. 生成随机数算法
 * 微信支付API接口协议中包含字段nonce_str，主要保证签名不可预测
 * 
 * 3. 商户证书
 * 详细查看: https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=4_3
 * 微信商户平台(pay.weixin.qq.com)-->账户中心-->账户设置-->API安全-->证书下载
 */

/**
 * 获取openid
 * https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=4_4
 */

/**
 * 获取用户ip指引（比较重要！！！）
 * https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=15_5
 * 
 * H5支付要求商户在统一下单接口中上传用户真实ip地址“spbill_create_ip”，为保证微信端获取的用户ip地址与商户端获取的一致，提供了以下获取用户ip的指引
 */

/**
 * 微信小程序获取openid
 * https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html#wxloginobject
 * 通过微信小程序登录获取临时凭证code，然后通过服务端发送https请求获取该小程序下的用户openid
 * https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
 */

/**
 * 统一下单
 * https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=9_20&index=1
 * 
 * URL地址：https://api.mch.weixin.qq.com/pay/unifiedorder
 */
var xml = require('xml');
var xmlToJs = require('xml2js');
var crypto = require('crypto');
var axios = require('axios');
var UnifiedOrderURL = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
var OrderQueryURL = 'https://api.mch.weixin.qq.com/pay/orderquery';
var JScodeToSessionURL = 'https://api.weixin.qq.com/sns/jscode2session';

module.exports = {
  /**
   * sign 签名方法
   * @param data: Object 待签名参数
   * @param secretKey: String key为商户平台设置的密钥key
   * @returns sign: 签名字符串
   */
  sign: function sign(data, secretKey) {
    var noneNullData = this.filter(data);
    var sortedKeys = this.sort(Object.keys(noneNullData));
    var stringA = sortedKeys.map(function (key) {
      return key + '=' + noneNullData[key];
    }).join('&');
    var stringSignTemp = stringA + '&key=' + secretKey;
    return this.md5(stringSignTemp).toUpperCase();
  },
  /**
   * filter 过滤函数，用于过滤空值
   * @param data: Object 签名之前的对象
   * @returns 非空的签名参数对象
   */
  filter: function filter(data) {
    var _ = {};
    if (!data || data.constructor.name !== 'Object') {
      console.error('Error: unexpected parameter `data` at method `filter`');
      return _;
    }
    var keys = Object.keys(data);
    keys.forEach(function (key) {
      var value = data[key];
      if (value && key !== 'sign') {
        _[key] = value;
      }
    });
    return _;
  },
  /**
   * sort 排序方法
   * @param keys: Array 签名参数对象的key组成的数组
   * @return 返回升序排序后key数组
   */
  sort: function sort(keys) {
    return keys.sort();
  },
  /**
   * randomStr 随机字符串生成方法
   * @returns 返回签名随机字符串
   */
  randomStr: function randomStr() {
    var str = Math.random() + '';
    return this.md5(str);
  },
  /**
   * md5 MD5加密方法
   * @param unSignStr: 加密前的字符串
   * @returns 经过MD5加密后的字符串
   */
  md5: function md5(unSignStr) {
    var MD5 = crypto.createHash('md5');
    return MD5.update(unSignStr).digest('hex');
  },
  /**
   * dataToArray 将Object对象转换为数组
   * @param data: Object
   * @returns 返回数组
   */
  dataToArray: function dataToArray(data) {
    var keys = Object.keys(data);
    return keys.map(function (key) {
      var _ = {};
      _[key] = data[key];
      return _;
    });
  },
  /**
   * objectToXml 将对象数据转换为xml格式
   * @param objArr: Array
   * @returns 返回xml格式
   */
  objectToXml: function objectToXml(objArr) {
    var xmlData = {
      xml: objArr
    };
    return xml(xmlData);
  },
  /**
   * xmlToObject 将xml字符串转换为对象
   * @param xmlStr: String
   */
  xmlToObject: function xmlToObject(xmlStr) {
    return new Promise(function (resolve, reject) {
      xmlToJs.parseString(xmlStr, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  /**
   * post 请求方法
   * @param url: 请求URL
   * @param xmlData: xml格式参数数据
   * @returns Promise
   */
  post: function post(url, xmlData) {
    return axios.post(url, xmlData, {
      headers: {
        'Accept': 'text/xml',
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    }).then(function (response) {
      return response.data;
    }) // 获取返回结果
      .then(this.xmlToObject); // 解析xml数据为JS对象;
  },
  /**
   * unifiedOrder 统一下单接口
   * @param xmlData
   * @returns Promise
   */
  unifiedOrder: function unifiedOrder(xmlData) {
    return this.post(UnifiedOrderURL, xmlData);
  },
  /**
   * orderQuery 订单查询接口
   * @param xmlData
   * @returns Promise
   */
  orderQuery: function orderQuery(xmlData) {
    return this.post(OrderQueryURL, xmlData);
  },
  /**
   * codeToSession 小程序获取openID接口
   * @param code 临时凭证
   * @returns Promise
   */
  codeToSession: function codeToSession(code) {
    return axios.get(JScodeToSessionURL + '?appid=' + config.wechatminiappid + '&secret=' + config.wechatminisecret + '&js_code=' + code + '&grant_type=authorization_code').then(function (response) {
      return response.data;
    }); // 获取返回结果
  },
  /**
   * 订单号补位方法，微信支付订单号位数不能太小
   * @param id 唯一订单号
   * @param length 最小长度
   * @returns 补位后的字符
   */
  fillZero: function fillZero(id, length) {
    if (!length || length < 1) length = 11;
    /**
     * String.padStart 方法也可以
     * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
     */
    return (Array(length).join('0') + id).slice(-length);
  },
  /**
   * 通过字符串时间格式 `201902021222` 转换为 Date对象
   * @param dateStr 时间字符串
   * @returns Date
   */
  strToDate: function strToDate(dateStr) {
    if (!dateStr || dateStr.length !== 14) {
      console.error('Error: Invalid Date of ' + dateStr);
      return null;
    }
    var year = dateStr.slice(0, 4);
    var month = parseInt(dateStr.slice(4, 6), 10) - 1;
    var day = dateStr.slice(6, 8);
    var hour = dateStr.slice(8, 10);
    var min = dateStr.slice(10, 12);
    var sec = dateStr.slice(12);
    return new Date(year, month, day, hour, min, sec);
  }
};