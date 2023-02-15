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

var id = sys.request.getString('_id');
var up = {
  name  : sys.request.getString('name', 2),
  uri   : sys.request.getString("uri"),
  authPass : sys.request.authPass,
  desc  : sys.request.desc,
  md    : new Date(),
}

var lib = require("./lib");
var coll = lib.db("conn-list");
var r = coll.updateOne({_id:id},  { $set: up });
if (r.getMatchedCount() < 1) {
  sys.ret(11);
  return;
}

sys.setRetData(0);