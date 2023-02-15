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

var chain_id = sys.request.getString('chain_id', 1, 45);
var s = "Select create_userid From sys_pl_chain Where chain_id = ?";

if (sql.query(s, [chain_id], 'chain') <= 0) {
  sys.setRetData(1, 'chain id 无效:'+ chain_id);
  return;
}


if (sys.result.chain[0].create_userid != sys.getUserIdByPID()) {
  sys.setRetData(1, '只有区块链创建者可以执行此操作');
  return;
}


var u1 = `UPDATE sys_pl_chain_signer
  SET
    privatekey = null,
    updatedt = now()
  WHERE chain_id = ? And type = 1`;

var u2 = `Update sys_pl_chain 
  SET
    offline_gpk = now(),
    updatedt = now()
  Where chain_id = ?`;
  
try {
  sql.update(u1, [chain_id], true);
  sql.update(u2, [chain_id], true);
  sql.commit();
} catch(e) {
  sql.rollback();
  sys.setRetData(1, '失败:'+ e.message);
  return;
}

sys.setRetData(0, "ok");