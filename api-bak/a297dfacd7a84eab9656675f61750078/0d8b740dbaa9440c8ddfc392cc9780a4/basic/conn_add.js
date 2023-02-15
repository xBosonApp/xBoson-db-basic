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

var now = new Date();
var conn = {
  _id   : lib.gid(),
  md    : now,
  cd    : now,
  name  : sys.request.getString("name"),
  uri   : sys.request.getString("uri"),
  desc  : sys.request.desc,
  authUser : sys.request.authUser,
  authPass : sys.request.authPass,
};

var coll = lib.db("conn-list");
coll.insert(conn);

sys.ret(0);