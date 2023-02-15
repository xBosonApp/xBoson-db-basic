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

var volid    = sys.request.getString('v', 1, 99);
var path     = sys.request.getSafePath('p');
var lib      = require("./lib");
var selfuser = sys.getUserIdByPID();

var v = lib.openVolumeRead(selfuser, volid);
var attr = lib.getAttr(volid, path);
if (!attr.isFile()) {
  throw new Error("不是文件 "+ path);
}

var chain = lib.openChain(v);
var cmap = lib.openTable("chain-map");
var block = lib.getBlock(chain, cmap, volid, path);

sys.put("key", block.key.toString());
sys.put("data", block.data);
sys.setRetData(0, 'ok');