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

var lib = require("./lib");
var ch  = lib.openCoinChain(se);
var lastBlockKey = ch.lastBlockKey();
var alluser = {};
var cc = 0;

while (lastBlockKey) {
  var b = ch.search(lastBlockKey);
  if (!b) break;
  if (b.type == 2) {
    ++cc;
    var data = JSON.parse(b.data);
    if (!alluser[data.user]) {
      alluser[data.user] = 0;
    }
    alluser[data.user] += data.coin;
  }
  lastBlockKey = b.previousKey;
}

var sqls = "Update sys_pl_boson_coin SET coin=? Where user_id=?";
for (var userid in alluser) {
  sql.update(sqls, [alluser[userid], userid]);
}

sys.setRetData(0, '核算完成, 共 '+ cc +' 笔交易');