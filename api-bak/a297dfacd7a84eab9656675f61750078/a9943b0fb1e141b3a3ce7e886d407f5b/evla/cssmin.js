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
  '/t/paas/lib/css/app_extend.css', // 4000ms
];
var attr = fs.readAttribute(file[0]);
fs.readFileContent(attr);
var code = attr.getContentToString();


var CleanCSS = require('clean-css');
var options = { 
  fetch: function (uri, inlineRequest, inlineTimeout, callback) {
    console.log('css fetch', uri);
    callback(new Error("unsupport"));
  },
  inline: false,
};
var output = new CleanCSS(options).minify(code);

sys.put('error', output.errors);
sys.put('used(ms)', Date.now()-start);
sys.put("efficiency", (output.stats.efficiency*100).toFixed(1)+'%');
sys.put('min', output.styles);
sys.setRetData(0, 'ok');