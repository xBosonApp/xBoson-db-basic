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

var assert = require("assert");

this.value1 = 100;
var vm = require('vm');
var context = vm.createContext({ a: 2 });
var ret = vm.runInContext("1+a", context);

assert.eq(3, ret, "1+a");

var thisContext = vm.createContext(this);
thisContext.value2 = 200;
var ret2 = vm.runInContext("[value1, value2]", thisContext, { filename: "test2.js" });

assert.eq(this.value1, ret2[0], 'value1');
assert.eq(thisContext.value2, ret2[1], 'value2');

sys.addRetData(ret, "vmRet");
sys.addRetData("vmRet2", ret2);
sys.setRetData(0, 'Do nothing.', 'vmRet', 'vmRet2');