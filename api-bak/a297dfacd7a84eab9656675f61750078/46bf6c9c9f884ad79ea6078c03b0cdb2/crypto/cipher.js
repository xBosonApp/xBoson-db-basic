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

var ps = 'fdjasklfd';
var crypto = require('crypto');
var buf = [];
var cc = crypto.createCipher('aes', ps);
buf.push(cc.update('123'));
buf.push(cc.update('abc'));
buf.push(cc.end());
var cdata = sys.joinBytes(buf);
sys.printValue(cdata);

var cd = crypto.createDecipher('aes', ps);
cd.update(cdata);
var data = cd.end();

sys.printValue('index[0]: '+ data[0]);

if ('123abc' == data.toJavaString()) {
  sys.setRetData(0, 'ok: '+ data.toJavaString());
} else {
  sys.setRetData(1, 'fail: '+ data.toJavaString());
}