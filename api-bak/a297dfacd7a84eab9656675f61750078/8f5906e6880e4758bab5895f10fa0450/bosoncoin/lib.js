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

module.exports = {
  openCoinChain : openCoinChain,
  push          : push,
  addSql        : addSql,
  minusSql      : minusSql,
};


function push(obj, se) {
  if (!obj) throw "push(obj) obj is null";
  var ch = openCoinChain(se);
  ch.push(JSON.stringify(obj));
}


function addSql() {
  return `
    UPDATE sys_pl_boson_coin
      SET
        coin = coin + ?,
        updatedt = now()
      WHERE user_id = ?`;
}


function minusSql() {
  return `
    UPDATE sys_pl_boson_coin
      SET
        coin = coin - ?,
        updatedt = now()
      WHERE user_id = ? and coin > ?`;
}


function openCoinChain(se) {
  var exp = se.getCache(_CACHE_REGION_CONFIG_, 'BOSON_COIN_CHAIN_EXP'); 
  if (!exp) {
    sys.setRetData(1, "缺少平台配置项 BOSON_COIN_CHAIN_EXP, 配置为区块链 ID/NAME");
    return;
  }
  var ch = require('chain');
  return ch.open(exp);
}