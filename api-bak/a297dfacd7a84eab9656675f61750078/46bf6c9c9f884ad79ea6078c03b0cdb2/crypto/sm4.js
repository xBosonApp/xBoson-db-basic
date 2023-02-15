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
var iv = crypto.randomBytes(16);
var ps = crypto.generateSm4Pass("123");
var cd = crypto.createCipher("SM4/CBC/PKCS5Padding", ps, iv);

var buf = [iv];
buf.push(cd.update("123456789abcdef0"));
buf.push(cd.end());
var res = crypto.joinBytes(buf);

sys.put("data", res);
sys.setRetData(0, 'Do nothing.');