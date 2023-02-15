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

var randstr   = sys.request.getString('rand', 1, 999);
var lib       = require("./lib");
var digest    = require("digest");
var sha256    = digest.sha256();
var ch        = lib.openCoinChain(se);

var lastBlockKey = ch.lastBlockKey();
sha256.update(lastBlockKey.toString());
sha256.update(randstr);

var hash = sha256.digest().bin();
var pay = 0;

if (hash[0] == 0) {
  pay += 0.000000001;
  if (hash[1] == 0) {
    pay += 0.0000002;
    if (hash[2] == 0) {
      pay += 0.000003;
      if (hash[3] == 0) {
        pay += 0.00004;
      }
    }
  }
} else {
  sys.setRetData(1, '无效的 HASH');
  return;
}


if (pay > 0) {
  try {
    var s = lib.addSql();
    
    if (sql.update(s, [pay, sys.getUserIdByPID()], true) > 0) {
      ch.push(JSON.stringify({
        user : sys.getUserIdByPID(),
        coin : pay,
        key  : lastBlockKey,
        rand : randstr,
        act  : 'mining',
      }));
      sql.commit();
      sys.setRetData(0, '挖矿成功, 奖励 '+ pay +' bosoncoin');
      return;
    }
  } catch(e) {
    sql.rollback();
    sys.setRetData(2, '挖矿失败, '+ e.message);
    return;
  }
}

sys.setRetData(1, '挖矿失败, Hash['+ hash[0]+ ','+ hash[1]+','+ hash[2] +','+ hash[3] +']');