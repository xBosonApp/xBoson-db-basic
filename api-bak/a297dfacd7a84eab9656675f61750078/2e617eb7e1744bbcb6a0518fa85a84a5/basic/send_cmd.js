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

var id = sys.request.getString("_id");
var k  = sys.requestParameterMap.k;
var v  = sys.requestParameterMap.v;

var cmd = {};
if (k == null || v == null) {
  sys.ret(1, "必须设置命令参数");
  return;
}

var count = 0;
for (var i=0; i<k.length; ++i) {
  if (k[i] == null || v[i] == null || k[i]=='' || v[i] == '') continue;
  cmd[ k[i] ] = v[i];
  count++;
}

if (count < 1) {
  sys.ret(1, "至少设置一个命令参数");
  return;
}

var iot = require("iot").open();
if (! iot.sendCommand(id, cmd)) {
  sys.ret(1, '命令发送失败, 没有找到可处理命令的线程');
  return;
}

sys.setRetData(0);