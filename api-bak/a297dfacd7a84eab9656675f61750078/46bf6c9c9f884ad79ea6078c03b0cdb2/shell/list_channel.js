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

//
// 查询区块链网络中的所有通道
// 参数: 无
// 返回: { channels:[] }
//
var sh = require('shell').open();
var ret = sh.execute("chaincode/channel-list");

if (ret.output.indexOf("ERR") >= 0) {
  sys.setRetData(1, ret.output);  
  return;
}

var line = ret.output.split("\n")
line = line.slice(2, line.length-2);

sys.addRetData("channels", line);
sys.setRetData(0, 'ok', 'channels');