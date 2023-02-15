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

var crypto = require('crypto');


// 加密解密格式: base64url(16字节iv + AES 加密数据)
module.exports = {
  decode : decode,
  encode : encode,
};


function decode(pass, data) {
  var ddata = crypto.toBytes(data, 'base64url');
  var iv = ddata.sub(0, 16);
  var ps = crypto.generateAesPass(pass);
  var cd = crypto.createDecipher("AES/CBC/PKCS5Padding", ps, iv);
  var buf = [];
  buf.push(cd.update(ddata.sub(16)));
  buf.push(cd.end());
  return crypto.joinBytes(buf);
}


function encode(pass, data) {
  var iv = crypto.generateAesIV();
  var ps = crypto.generateAesPass(pass);
  var cc = crypto.createCipher("AES/CBC/PKCS5Padding", ps, iv);
  var buf = [iv];
  buf.push(cc.update(data));
  buf.push(cc.end());
  var cdata = crypto.joinBytes(buf);
  return cdata.toString("base64url");
}