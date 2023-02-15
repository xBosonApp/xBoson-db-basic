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
"use strict"

function abc() {
  console.log('hello world');
}

var str = abc + '';

var rmod = require('./rmod');

sys.printValue(str);
sys.printValue(rmod);
sys.addRetData(rmod, 'mod');

if (str.indexOf('hello') >= 0) {
  sys.setRetData(1, "源代码泄漏");
} else {
  sys.setRetData(0, '源代码安全', "mod");
}