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

var bcid = sys.request.getString('bcid', 10, 99);
var name = sys.request.getString('name', 3, 30);

var lib  = require("./lib");
var vol  = lib.openTable('volume');
var id   = 'v'+ sys.nextId();

try {
  lib.openChain({ bc: bcid });
} catch(err) {
  sys.setRetData(1, '无效的区块链 ID: '+ bcid);
  return;
}

vol.insert({
  _id     : id,
  owner   : sys.getUserIdByPID(),
  name    : name,
  bc      : bcid,
  ctime   : new Date().getTime(),
  reader  : [],
  writer  : [],
});

lib.createDir(id, '');

sys.put('id', id);
sys.setRetData(0, 'ok');