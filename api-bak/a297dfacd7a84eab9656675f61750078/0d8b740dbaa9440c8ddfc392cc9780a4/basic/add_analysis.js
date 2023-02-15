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
var a = {
  _id   : lib.gid(),
  connid: sys.request.getString("connid"),
  name  : sys.request.getString("name"),
  cql   : sys.request.getString("cql"),
  tpl   : sys.request.tpl,
};

var coll = lib.db("analysis");
coll.insert(a);

sys.put('data', {
  name : a.name,
  _id  : a._id,
});
sys.setRetData(0);