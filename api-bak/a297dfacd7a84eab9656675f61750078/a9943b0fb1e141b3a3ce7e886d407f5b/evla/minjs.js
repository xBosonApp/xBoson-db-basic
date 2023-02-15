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

var start = Date.now();
var fs = require('fs').open("ui");
var file = [
  '/t/paas/lib/js/zy/zy.js', // 4000ms
  '/t/paas/lib/js/zy/zy_extend.js', // 300ms
  '/t/paas/login.js', // 2826
];
var attr = fs.readAttribute(file[1]);
fs.readFileContent(attr);

var jscode = attr.getContentToString();
var UglifyJS = require("uglify-js-min");
// var code = "function add(first, second) { return first + second; }";
var result = UglifyJS.minify(jscode);

sys.put('used(ms)', Date.now()-start);
sys.put("efficiency", (result.code.length/jscode.length*100).toFixed(1)+'%');
if (result.error) {
  sys.setRetData(1, result.error);
} else {
  sys.setRetData(0, result.code.substring(0, 100));
}