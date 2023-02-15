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

var where = {};
if (sys.request.name) {
  where.name = sys.request.name;
}
if (sys.request._id) {
  where._id = sys.request._id;
}

var coll = lib.db("conn-list");
var data = coll.find2(where).page(sys).toArray();

sys.put("data", data);
sys.put("count", data.length);
sys.ret(0);