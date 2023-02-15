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

var where = { $or : [
  { owner : sys.getUserIdByOpenId() },
  { share : sys.getUserIdByOpenId() },
]};

if (sys.request.name) {
  where.name = sys.request.name;
}

var list = lib.open("scenes").find(where, sys.request.pagenum, sys.request.pagesize);

sys.put("data", list);
sys.put("count", lib.open("scenes").count(where));
sys.ret(0);