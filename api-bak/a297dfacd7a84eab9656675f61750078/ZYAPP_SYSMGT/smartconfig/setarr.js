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

var name = sys.request.getString('name', 1, 50);
var k = sys.requestParameterMap.k;
var v = sys.requestParameterMap.v;
var t = sys.requestParameterMap.t;
if (k == null || k.length < 1) {
  return sys.setRetData(1, '至少有一个配置项');
}

var setting = {};
var tpl = {};
var type = [String, Number, Boolean];

for (var i=k.length-1; i>=0; --i) {
  if (k[i] && v[i] !== undefined && v[i] !== null && t[i]>=0) {
    setting[k[i]] = (type[t[i]] || String)(v[i]);
    tpl[k[i]] = t[i];
  }
}

var c = require('config');
c.set(name, setting);
c.putTemplate(name, tpl);
sys.setRetData(0, 'ok');