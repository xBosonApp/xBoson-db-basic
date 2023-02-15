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

var msg;
var pid = sys.request.getInteger('pid', false);
var nid = sys.request.getString("nid", 1, 10);
var pm = require('pm').open();

switch (pm.kill(nid, pid)) {
  case pm.KILL_OK: 
    msg = "进程 " + pid + " 被杀死";
    break;
    
  case pm.KILL_NO_EXIST:
    msg = "进程 " + pid + " 不存在";
    break;
    
  case pm.KILL_NO_READY:
    msg = "进程 " + pid + " 未初始化完成";
    break;
    
  case pm.KILL_IS_KILLED:
    msg = "进程 " + pid + " 已结束";
    break;
}

sys.setRetData(0, msg);