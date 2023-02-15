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

var mode = 'sm2c1c3c2';

var crypto = require('crypto');
var key = crypto.ECKeyPair();
var cc = crypto.createCipher(mode, key.publicKey);

var all = [];
all.push(cc.update('123'));
all.push(cc.update('abc'));
all.push(cc.end());
var res = sys.joinBytes(all);

var cd = crypto.createDecipher(mode, key.privateKey);
all = [];
all.push(cd.update(res));
all.push(cd.end());
var src = sys.joinBytes(all);

sys.put('data', res);
sys.put('src', src.toJavaString());
sys.put("public", key.publicKey);
sys.put("private", key.privateKey);
sys.setRetData(0, 'Do nothing.');