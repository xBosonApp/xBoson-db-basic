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

var chainName   = sys.request.org +'@'+ sys.uuid();
var channelName = 'ch0';
var consensus   = sys.request.getString('consensus', 0);
var roleid      = sys.request.roleid || null;

var bind = [
  sys.uuid(),
  sys.request.getString('name', 1, 45),
  sys.getUserIdByPID(),
  channelName,
  chainName,
  sys.request.org,
  consensus,
  roleid,
  ];
  
var s = `
INSERT INTO sys_pl_chain
  ( chain_id,
    name,
    status,
    createdt,
    updatedt,
    offline_gpk,
    create_userid,
    physical_channel,
    physical_chain,
    orgid,
    consensus,
    roleid
  ) VALUES (
    ?, ?, '1', now(), now(), null, ?, ?, ?, ?, ?, ?
  ) `;

var bind2 = [
  chainName, 
  channelName,
  1,
  null,
  null,
  bind[0],
  '1',
];

var s2 = `
INSERT INTO sys_pl_chain_signer
  ( chain_name,
    channel_name,
    type,
    publickey,
    privatekey,
    chain_id,
    status,
    createdt,
    updatedt
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, now(), now()  
) `;

try {
  var ch = require('chain');
  var keypairs = [];
  for (var i=1; i<=ch.TYPE_LENGTH; ++i) {
    var keypair = ch.generateKeyPair();
    bind2[2] = i;
    bind2[3] = keypair.publicKey;
    bind2[4] = keypair.privateKey;
    keypairs.push(keypair);
    
    if (sql.update(s2, bind2, true) <=0) {
      sys.setRetData("5", "创建密钥失败 "+ i);
      return;
    }
  }
  
  
  if (sql.update(s, bind, true) <=0) {
    sys.setRetData("5", "创建区块链失败");
    return;
  }
  
  ch.create(chainName, channelName, consensus, keypairs);
  sql.commit();
  sys.setRetData(0, '区块链已经创建');
  
} catch(e) {
  sql.rollback();
  sys.setRetData("1", "创建区块链失败, "+ (e.message || e));
  //throw e;
}