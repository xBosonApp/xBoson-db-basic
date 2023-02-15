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
var all = [];
var cc = crypto.createCipher('aes', "1234567");
all.push(cc.update("0001000100010001-0001000100010001"));
all.push(cc.end());

var bt = sys.joinBytes(all);
// Jneicx2cMUM2EJd43cYxT3kFxqBktnEbRJjGfWGiSRg
sys.put('data', bt.toString('base64'));
sys.setRetData(0);