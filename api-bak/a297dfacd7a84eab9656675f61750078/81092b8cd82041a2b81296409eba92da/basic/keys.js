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


var names = ['无', '创世区块密钥', '数据密钥', '加密数据密钥', '链码密钥', '消息密钥'];
var hidePrivateKey = (sys.result.chain[0].create_userid != sys.getUserIdByPID());
var hpk = "********";

var s2 = "Select * From sys_pl_chain_signer Where chain_id = ? Order by type";
sql.query(s2, [chain_id]);


var data_arr = sys.result.result;
for (var i=0; i< data_arr.length; ++i) {
  var s = data_arr[i];
  if (hidePrivateKey && s.privatekey) {
    s.privatekey = hpk;
  }
  s.type_name = names[s.type];
}

sys.setRetData(0, 'ok', 'result');