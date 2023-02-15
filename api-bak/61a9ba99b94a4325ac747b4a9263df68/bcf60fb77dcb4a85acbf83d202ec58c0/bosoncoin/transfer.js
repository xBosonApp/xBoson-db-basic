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

var target_user = sys.request.getString('userid', 1, 45);
var coin = sys.request.getFloat("coin", true, 0);
var lib = require("./lib");
var ch = lib.openCoinChain(se);

if (coin == 0) {
  sys.setRetData(0, "无操作");
  return;
}

var a = lib.addSql();
var m = lib.minusSql();

try {
  if (sql.update(m, [coin, sys.getUserIdByPID(), coin], true) < 1) {
    throw new Error("余额不足 "+ sys.getUserIdByPID());
  }
  
  if (sql.update(a, [coin, target_user], true) < 1) {
    throw new Error("找不到用户帐号 "+ target_user);
  }
  
  ch.push({
    user: sys.getUserIdByPID(),
    coin: -coin,
    to  : target_user,
    act : 'transfer',
  });
  
  ch.push({
    user: target_user,
    coin: coin,
    to  : sys.getUserIdByPID(),
    act : 'transfer',
  });
  
  sql.commit();
  sys.setRetData(0, '转账成功');
  
} catch(e) {
  sql.rollback();
  sys.setRetData(1, '转账失败: ' + e.message);
}