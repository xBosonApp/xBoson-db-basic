/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";

// 来自 '文档' 2.4
var appid  = '53433eac454c4872b3e6d3325b04fae2';
var appid2 = 'VDWQTI7G0PLUGYGE646FGE73NHVQQKRV';
var aeskey = '5Bv%Vw6fiz5pSu$k';

// 来自 '文档' 3.1.2(第8页), ivstr 在实际应用中随机生成
var ivstr  = 'AtuaEAI7NZB63VzB'
//'5ffee638075f4fce80cedfa933650487'
// 对方生成的 md5 从左面起如果是 '0' 可能被忽略
var qmsign = '026e6e8d3cdc1c21ca4dd4c65e609531'

// 要加密的 json 字符串
var json = '{"list":[{"marketPrice":100,"sellingPrice":10,"operationType":"INSERT","time":1,"businessType":"EXAMINATION","productNo":"15124068921","productName":"xxx套餐","goodsType":"PRODUCT"},{"marketPrice":100,"sellingPrice":10,"operationType":"INSERT","time":1,"businessType":"EXAMINATION","productNo":"15124068923","productName":"xxx套餐","goodsType":"PRODUCT"},{"marketPrice":100,"sellingPrice":10,"operationType":"INSERT","time":1,"businessType":"EXAMINATION","productNo":"15124068925","productName":"xxx套餐","goodsType":"PRODUCT"}]}';

// 用于解密测试, 这个数据已经被 URI 编码
// '文档' 中提供的数据错误, 这个变量最终没有使用
// var uri_body = "dvsboIdhSBnldm0nZrpdSKa5%2FfD6UNfVJEXT%2BiSRHNbyl1%2BLwdBxcZF%2BR%2FB3hYgpaYe3Ae6UMNAN5SZym3xwCcGM5Rlvo3G5lYOtb3bTLs6Uaw59VE9ls2%2FjuDim1GRVyD41axecZSzZcD71gnnB9Joqz4B7sk%2FQJi6tvSmrndXrYEKTCYv3wHZwjJI%2BUdJjGcMz2aSoMrMFBeA45L7flGbq1Mg1ELv86N2J%2FrzFFoQ%3D";

// var body = decodeURIComponent(uri_body);
// 这些数据使用对方提供的 java 代码生成
// 按照文档中说明, 似乎应该对 这个字符串做一些处理比如 encodeURIComponent(body)
// 本代码没有做处理
var body = "tzvdR/X2rvCwe/fbSesLEa3HzY3v3L1ZvmPB4Vx+IcHxM+aaUvKDU/9vNYhvBG2JE2E5XqpKnhFMdEe4kTtmCG2w0jFlZFEbDcM0RK2zxXDEdwblL8Y0z9PdO7HQgju43FcHDc2hal4CLgujwWfWT2NK1CoPefEX6H7vIZeQgtPk7xJkuYqHlNDhyE0/QcR0KwUGIo8OiSYIG2m3HeBu7ukxJSDCnSMaOS5GZptV4Bkniz+80X7wDoV5VQpW+KDTS0vhcbwlBnujNCfVJ+TeU8NzN60i8zbeCHl0G4Q9ZyOE/4zWTVvk0pOnStMRMo7KJJk2IkOWrkBQTa2q5ZeR0WN7HkWXgD6maQeSl3zGdmnmN6TX1fHMpPALreZBp/mKejWWm9KeqoSc/0jF6p2dvvYIPzPSUVRS7SvCLACOoq1yrGjz9ZgO21uhH9sgeNukakgfeQ2tqXObTMMiE//nn3HeltjprZ7KPG0nkebZhxrqrzzvS5thFGDJsk1O93acnoMm7xDUQ2u7v6Z5Q/oTrN/8aHuY6tokpz1TnCE5osFw1cNCZCgqRgG7xw6Hjt9fPf9Tews8q9TeqGzPa9+IJWkF37EXEnp7t70w+1SOeA1MtJFm8fV/DgacQHl03tj69uc4G9SbRE7v0ysoBZPZ78iE/lRx0vw+JFUsAGmj99DVIeooR3BNItvUiOu1ZGXN+slfB7GcxkrrWvsBI0DuGQ=="
// sys.put("body", body);

// 将 iv 和 aes 密钥转换为平台字节数组
var iv = sys.toBytes(ivstr);
var key = sys.toBytes(aeskey);

// 签名测试, 结果和对方提供的java代码产生的结果一致
var tsign = sign(aeskey, body, appid2, iv);
sys.put("sign_check", qmsign == tsign);
if (qmsign != tsign) {
  sys.put("test_sign", [tsign, qmsign]);
  // sys.put('ivlen', iv.length());
}

// 解密测试, 结果和对方提供的java代码产生的结果一致
// 返回的字符串可以解析为 json
var undata = decode(key, iv, body);
sys.put('decode-test', undata == json);
if (undata != json) {
  sys.put("decode-src", undata);
  sys.put("decode-tar", json);
}

// 加密测试, 结果和对方提供的java代码产生的结果一致
// 返回的数据需要按照 '文档' 中的要求进一步处理
var endata = encode(key, iv, json);
sys.put('encode-test', endata == body);
if (endata != body) {
  sys.put("encode-src", endata);
  sys.put("encode-tar", body);
}


//
// 针对三江接口的数据签名
// aeskey : 密钥
// data : 加密后的数据
// appid : 应用id
// ivstr : iv 的字符串形式
// 返回 Bytes 对象 6C1C692548893F2A9E1EF76C16C9DFED
//
function sign(aeskey, data, appid, ivstr) {
  var digest = require("digest");
  var md = digest.md5();
  // var d = aeskey + data + appid + ivstr;
  // md.update(d);
  md.update(aeskey);
  md.update(data);
  md.update(appid);
  md.update(ivstr);
  var d = md.digest();
  // sys.put("sign", d.toHex())
  return d.toHex().toLowerCase();
}


//
// 针对三江接口的解密
// pass : Bytes 对象, aes 密钥
// iv : Bytes 对象 加密向量
// data : 待解密的 base64 字符串(按照文档的说明, 似乎需要先执行decodeURIComponent)
// 返回解密后的字符串
//
function decode(pass, iv, data) {
  var crypto = require("crypto");
  var ddata = crypto.toBytes(data, 'base64');
  if (ddata.length() % 16 > 0) {
    throw new Error("AES数据错误, 数据长度不是 16 的倍数, "+ ddata.length());
  }
  
  var cd = crypto.createDecipher("AES/CBC/NoPadding", pass, iv);
  var buf = [];
  buf.push(cd.update(ddata));
  buf.push(cd.end());
  
  var ret = crypto.joinBytes(buf).toJavaString();
  for (var i=ret.length()-1; i>=0; --i) {
    if (ret[i] != '\u0000') break;
  }
  return ret.substr(0, i+1);
}


//
// 针对三江接口的加密
// pass : Bytes 对象, aes 密钥
// iv : Bytes 对象 加密向量
// data : 待加密的字符串
// 返回加密后数据的 base64 编码的字符串
//
function encode(pass, iv, data) {
  var crypto = require("crypto");
  // var iv = crypto.generateAesIV();
  // var ps = crypto.generateAesPass(pass);
  var cc = crypto.createCipher("AES/CBC/NoPadding", pass, iv);
  var bytes = crypto.toBytes(data);
  var buf = [];
  buf.push(cc.update(bytes));
  // sys.put('x1', [data.length(), bytes.length()])
  
  var lenx = bytes.length() % 16;
  if (lenx > 0) {
    var padding = sys.toBytes("00", 'hex');
    for (var i=lenx; i<16; ++i) {
      buf.push(cc.update(padding))
    }
  }
  buf.push(cc.end());
  // return crypto.joinBytes(buf);
  return crypto.joinBytes(buf).toString("base64");
}